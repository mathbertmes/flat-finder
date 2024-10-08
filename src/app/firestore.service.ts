import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Flat } from './interfaces/flat.interface';

import { from, Observable } from 'rxjs';

import { User } from './interfaces/user.interface';
import { Message } from './interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore = inject(Firestore);


  async createFlat(flat: Flat): Promise<void> {
    const tasksCollection = collection(this.firestore, 'flats');
    await addDoc(tasksCollection, flat);

    const userFlatsCounter = parseInt(localStorage.getItem("userFlatsCounter")!) + 1

    localStorage.setItem("userFlatsCounter", JSON.stringify(userFlatsCounter))

    const updatedUser = {
      flatsCounter : userFlatsCounter
    }

    this.updateUser(localStorage.getItem("userId")!, updatedUser)
  }

  async createUser(user: User): Promise<void> {
    const userDocRef = collection(this.firestore, 'users');
    await addDoc(userDocRef, user)

  }

  loginFirestore(email: string, password: string): Observable<User[]>{
    const userCollection = collection(this.firestore, 'users'); 
    const userQuery = query(
      userCollection,
      where('email', '==', email),
      where('password', '==', password)
    )
   
    return collectionData(userQuery, { idField: 'id' }) as Observable<User[]>;
  }
  

  getUser(id: string): Observable<User | undefined>{
    const userDocRef = doc(this.firestore, 'users', id);

    return docData(userDocRef, { idField: 'id' }) as Observable<User | undefined>;
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


  getFlat(id: string): Observable<Flat | undefined> {
    const flatDocRef = doc(this.firestore, 'flats', id);

    
    return from(
      getDoc(flatDocRef).then((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Flat;
        } else {
          return undefined; 
        }
      })
    );
  }

  async updateUser(userId: string, updatedData: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userId);
    await updateDoc(userDocRef, updatedData);
  }

  async updateFlat(flatId: string, updatedData: Partial<Flat>): Promise<void> {
    const userDocRef = doc(this.firestore, 'flats', flatId);
    await updateDoc(userDocRef, updatedData);
  }


  

  deleteUserData(userId: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userId);
    return deleteDoc(userDocRef);
  }

  deleteFlatData(flatId: string): Promise<void> {

    const userFlatsCounter = parseInt(localStorage.getItem("userFlatsCounter")!) - 1

    localStorage.setItem("userFlatsCounter", JSON.stringify(userFlatsCounter))

    const updatedUser = {
      flatsCounter : userFlatsCounter
    }

    this.updateUser(localStorage.getItem("userId")!, updatedUser)

    const userDocRef = doc(this.firestore, 'flats', flatId);
    return deleteDoc(userDocRef);
  }

  //MESSAGES

  async createMessage(message: Message): Promise<void> {
    const messagesCollection = collection(this.firestore, 'messages');
    await addDoc(messagesCollection, message);
  }

  getFlatMessages(flatId: string): Observable<Message[]> {
    const messageCollection = collection(this.firestore, 'messages');
    const messagesQuery = query(messageCollection, where("flatId", '==', flatId));
    return collectionData(messagesQuery, { idField: 'id' }) as Observable<
    Message[]
    >;
  }

  getFlatMessagesByUser(flatId: string, userId: string): Observable<Message[]> {
    const messageCollection = collection(this.firestore, 'messages');
    const messagesQuery = query(messageCollection, where("flatId", '==', flatId), where("userId", '==', userId));
    return collectionData(messagesQuery, { idField: 'id' }) as Observable<
    Message[]
    >;}
}
