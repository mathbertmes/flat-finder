import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from "@angular/fire/firestore";
import { Flat } from "./interfaces/flat.interface";



@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore = inject(Firestore)


  async createFlat(flat: Flat): Promise<void> {
    const tasksCollection = collection(this.firestore, 'flats'); 
    await addDoc(tasksCollection, flat); 
  }

}