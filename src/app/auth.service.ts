import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
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
    birthDate: Date,
  ): Observable<void> {
    console.log(email, password, firstName, lastName)
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      let newUser: User = {
        uid: response.user.uid,
        email,
        firstName,
        lastName,
        birthDate,
        role: 'user',
        favorites: [],
        deleted: false
      };
      updateProfile(response.user, {
        displayName: `${firstName} ${lastName}`,
      });

      this.firestoreFunctions.createUser(response.user.uid, newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('userFavorites', JSON.stringify(newUser.favorites));
      localStorage.setItem('userFullName', `${firstName} ${lastName}`);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', newUser.role)
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
      console.log(response.user);
      this.firestoreFunctions.getUser(response.user.uid).subscribe((user) => {
        if (user.length) {
          if(user[0].deleted){
            alert("This user is banned")
            this.logout()
          }else{
            localStorage.setItem('user', JSON.stringify(user[0]));
            localStorage.setItem(
            'userFavorites',
            JSON.stringify(user[0].favorites)
          );
          localStorage.setItem('userRole', user[0].role)
          localStorage.setItem('userFullName', response.user.displayName!);
          localStorage.setItem('userEmail', response.user.email!);
          localStorage.setItem('userId', response.user.uid);
          }
          
        }
      });

    });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    localStorage.removeItem('userFavorites');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole')
    return from(promise);
  }

  updateProfile(
    email: string,
    firstName: string,
    lastName: string,
    birthDate: Date
  ): Observable<void> {
    const user = this.firebaseAuth.currentUser;

    if (user) {
      const updatedUser = {
        uid: user.uid,
        email,
        firstName,
        lastName,
        birthDate,
      };

      // Firebase Auth の表示名更新
      const promise = updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      }).then(() => {
        // Firestore のユーザーデータを更新
        this.firestoreFunctions.updateUser(user.uid, updatedUser);

        // ローカルストレージの更新
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userFullName', `${firstName} ${lastName}`);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', user.uid);
      });

      return from(promise);
    } else {
      return of(); // エラー処理を適宜追加
    }
  }
}
