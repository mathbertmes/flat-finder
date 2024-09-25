import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from "@angular/fire/firestore";
import { Flat } from "./interfaces/flat.interface";
import { Observable } from "rxjs";
import { User } from "./interfaces/user.interface";



@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore = inject(Firestore)

  //CREATE
  async createFlat(flat: Flat): Promise<void> {
    const tasksCollection = collection(this.firestore, 'flats'); 
    await addDoc(tasksCollection, flat); 
  }

  async createUser(user: User): Promise<void> {
    const usersCollection = collection(this.firestore, 'users'); 
    await addDoc(usersCollection, user); 
  }

  getUser(id: string): Observable<User> {
    const usersCollection = collection(this.firestore, 'users'); 
    const userQuery = query(
      usersCollection,
      where("id", "==", id)
    )

    return collectionData(userQuery, { idField: 'id' }) as Observable<User>;
  }



  //READ ALL FLATS
  getFlats(): Observable<Flat[]> {
    const flatsCollection = collection(this.firestore, 'flats'); 
    const userTasksQuery = query(
      flatsCollection
    )
    return collectionData(userTasksQuery, { idField: 'id' }) as Observable<Flat[]>;
  }

}