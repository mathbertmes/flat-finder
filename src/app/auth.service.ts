import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { User } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestoreFunctions = inject(FirestoreService);
  user$ = user(this.firebaseAuth);
  userId$: string | undefined;


  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: Date
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      let newUser : User = {
        id: response.user.uid,
        email,
        firstName,
        lastName,
        birthDate,
        role: "user",
        favorites: []
      }
      updateProfile(response.user, { displayName: `${firstName} ${lastName}` });
      this.firestoreFunctions.createUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("userFullName", `${firstName} ${lastName}`);
      localStorage.setItem("userEmail", email)
      localStorage.setItem('userId', response.user.uid);
      
    });
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      this.firestoreFunctions.getUser(response.user.uid).subscribe((user) => {
        if(user.length){
          localStorage.setItem("user", JSON.stringify(user[0]))
        }
      })
      localStorage.setItem("userFullName", response.user.displayName!)
      localStorage.setItem("userEmail", response.user.email!)
      localStorage.setItem('userId', response.user.uid)
    })
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    localStorage.removeItem("userFullName")
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('user')
    return from(promise);
  }
}
