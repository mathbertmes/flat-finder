import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from "@angular/fire/firestore";
import { Flat } from "./interfaces/flat.interface";
import { Observable } from "rxjs";



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

  //READ ALL FLATS
  getFlats(): Observable<Flat[]> {
    const tasksCollection = collection(this.firestore, 'flats'); 
    const userTasksQuery = query(
      tasksCollection
    )
    return collectionData(userTasksQuery, { idField: 'id' }) as Observable<Flat[]>;
  }

}