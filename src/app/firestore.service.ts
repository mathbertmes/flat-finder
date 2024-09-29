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
import { map, Observable } from 'rxjs';
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
    const flatsCollection = collection(this.firestore, 'users');
    const userTasksQuery = query(flatsCollection);
    return collectionData(userTasksQuery, { idField: 'id' }) as Observable<
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

  //READ ONE FLATS
  getFlat(flatId: string): Observable<Flat[]> {
    const flatsCollection = collection(this.firestore, 'flats');
    const userQuery = query(flatsCollection);

    return collectionData(userQuery, { idField: 'id' }).pipe(
      map((flats: Flat[]) => {
        // 取得したフラットデータをログに表示して確認
        console.log('Flats from Firestore:', flats);

        // 各フラットの message フィールドが存在するか確認し、さらに message が配列かどうかを確認
        return flats.filter((flat) => {
          if (!flat.message || !Array.isArray(flat.message)) {
            console.warn(
              `Flat document ${flat.userId} does not have a valid message field.`,
              flat
            );
            return false;
          }

          // message 配列内の要素が flatId と一致するかどうかを確認
          return flat.message.some((msg) => msg.flatDocument === flatId);
        });
      })
    );
  }

  async updateUser(userId: string, updatedData: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userId);
    await updateDoc(userDocRef, updatedData);
  }

  async updateFlat(userId: string, updatedData: Partial<Flat>): Promise<void> {
    const userDocRef = doc(this.firestore, 'flats', userId);
    await updateDoc(userDocRef, updatedData);
  }
}
