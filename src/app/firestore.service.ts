import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Flat } from './interfaces/flat.interface';
import { Observable } from 'rxjs';
import { User } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore = inject(Firestore);

  //CREATE
  async createFlat(flat: Flat): Promise<void> {
    const tasksCollection = collection(this.firestore, 'flats');
    await addDoc(tasksCollection, flat);
  }

  async createUser(userId: string, user: User): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userId);
    await setDoc(userDocRef, user);
  }

  getUser(id: string): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const userQuery = query(usersCollection, where('uid', '==', id));

    return collectionData(userQuery, { idField: 'id' }) as Observable<User[]>;
  }

  getAllUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const usersQuery = query(usersCollection, where('deleted', '==', false));
    return collectionData(usersQuery, { idField: 'id' }) as Observable<
      User[]
    >;
  }

  //READ ALL FLATS FROM USER
  getUserFlats(userId: string): Observable<Flat[]> {
    const flatsCollection = collection(this.firestore, 'flats');
    const userQuery = query(flatsCollection, where('userId', '==', userId));

    return collectionData(userQuery, { idField: 'id' }) as Observable<Flat[]>;
  }

  //READ ALL FLATS
  getFlats(): Observable<Flat[]> {
    const flatsCollection = collection(this.firestore, 'flats');
    const userTasksQuery = query(flatsCollection);
    return collectionData(userTasksQuery, { idField: 'id' }) as Observable<
      Flat[]
    >;
  }

  async updateUser(userId: string, updatedData: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userId);
    await updateDoc(userDocRef, updatedData);
  }

  deleteUserData(userId: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userId);
    return deleteDoc(userDocRef);
  }
}
