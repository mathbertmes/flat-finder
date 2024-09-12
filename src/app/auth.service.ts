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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  userId$: string | undefined;


  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      updateProfile(response.user, { displayName: `${firstName} ${lastName}` });
      localStorage.setItem("userFullName", `${firstName} ${lastName}`);
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
      localStorage.setItem("userFullName", response.user.displayName!)
      localStorage.setItem('userId', response.user.uid)
    })
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    localStorage.removeItem("userFullName")
    localStorage.removeItem('userId')
    return from(promise);
  }
}
