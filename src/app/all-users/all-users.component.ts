import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { Flat } from '../interfaces/flat.interface';
import { FirestoreService } from '../firestore.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  firestore = inject(FirestoreService);

  // Ensure the observable won't emit null values, falling back to an empty array
  users$: any = [];

  displayedColumns: string[] = [
    'city',
    'userFullName',
    'userEmail',
    'streetNumber',
  ];

  formFilter = new FormGroup({
    city: new FormControl(''),
    minPrice: new FormControl(0),
    maxPrice: new FormControl(0),
    minArea: new FormControl(0),
    maxArea: new FormControl(0),
  });

  onFilter() {
    let allUsers: Flat[] = [];
    this.firestore.getFlats().subscribe((flats) => {
      if (flats) {
        console.log(flats);
        const rawForm = this.formFilter.getRawValue();

        if (rawForm.city) {
          flats = flats.filter((flat) =>
            flat.city.toUpperCase().includes(rawForm.city!.toUpperCase())
          );
        }
        if (rawForm.minPrice !== 0) {
          flats = flats.filter((flat) => flat.rentPrice >= rawForm.minPrice!);
        }
        if (rawForm.maxPrice !== 0) {
          flats = flats.filter((flat) => flat.rentPrice <= rawForm.maxPrice!);
        }
        if (rawForm.minArea !== 0) {
          flats = flats.filter((flat) => flat.areaSize >= rawForm.minArea!);
        }
        if (rawForm.maxArea !== 0) {
          flats = flats.filter((flat) => flat.areaSize <= rawForm.maxArea!);
        }

        console.log(flats);

        this.users$ = flats;
      } else {
        allUsers = [];
      }
    });
  }

  ngOnInit(): void {
    this.firestore.getFlats().subscribe((flats) => {
      if (flats) {
        this.users$ = flats;
      } else {
        this.users$ = [];
      }
    });
  }
}
