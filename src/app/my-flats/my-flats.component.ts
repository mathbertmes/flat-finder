import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../firestore.service';
import { Flat } from '../interfaces/flat.interface';

@Component({
  selector: 'app-my-flats',
  standalone: true,
  imports: [MatTableModule,
    CommonModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,],
  templateUrl: './my-flats.component.html',
  styleUrl: './my-flats.component.css',
})
export class MyFlatsComponent implements OnInit{

  firestore = inject(FirestoreService);

  // Ensure the observable won't emit null values, falling back to an empty array
  flats$: Flat[] = [];
  userId = localStorage.getItem('userId')

  displayedColumns: string[] = [
    'city',
    'userFullName',
    'userEmail',
    'streetNumber',
    'areaSize',
    'hasAc',
    'yearBuild',
    'rentPrice',
    'dataAvailable',
  ];

  ngOnInit(): void {
    this.firestore.getUserFlats(this.userId!).subscribe((flats) => {
      if (flats) {
        this.flats$ = flats;
      } else {
        this.flats$ = [];
      }
    });
  }

}
