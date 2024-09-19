import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { Flat } from '../interfaces/flat.interface';
import { FirestoreService } from '../firestore.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatPaginator, MatPaginatorModule], // Add CommonModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  firestore = inject(FirestoreService);
  
  // Ensure the observable won't emit null values, falling back to an empty array
  flats$: Flat[] = [];
  
  displayedColumns: string[] = ['city', 'userFullName', 'userEmail', 'streetNumber', 'areaSize', 'hasAc', 'yearBuild', 'rentPrice', 'dataAvailable'];

  ngOnInit(): void {
    this.firestore.getFlats().subscribe(flats => {
      if(flats){
        this.flats$ = flats
      }else{
        this.flats$ = []
      }
    });
  }
}
