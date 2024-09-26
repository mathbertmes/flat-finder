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
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

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
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  firestore = inject(FirestoreService);

  // Ensure the observable won't emit null values, falling back to an empty array
  users$: any = [];

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'userEmail',
    'streetNumber',
    'flatsCounter',
    'IsAdmin',
    'operation',
  ];

  formFilter = new FormGroup({
    userType: new FormControl(''),
    minAge: new FormControl(0),
    maxAge: new FormControl(0),
    minFlatsCounter: new FormControl(0),
    maxFlatsCounter: new FormControl(0),
    IsAdmin: new FormControl(),
  });

  onFilter() {
    let allUsers: Flat[] = [];
    this.firestore.getFlats().subscribe((flats) => {
      if (flats) {
        console.log(flats);
        const rawForm = this.formFilter.getRawValue();

        if (rawForm.userType) {
          flats = flats.filter((flat) =>
            flat.city.toUpperCase().includes(rawForm.userType!.toUpperCase())
          );
        }
        if (rawForm.minAge !== 0) {
          flats = flats.filter((flat) => flat.rentPrice >= rawForm.minAge!);
        }
        if (rawForm.maxAge !== 0) {
          flats = flats.filter((flat) => flat.rentPrice <= rawForm.maxAge!);
        }
        if (rawForm.minFlatsCounter !== 0) {
          flats = flats.filter(
            (flat) => flat.areaSize >= rawForm.minFlatsCounter!
          );
        }
        if (rawForm.maxFlatsCounter !== 0) {
          flats = flats.filter(
            (flat) => flat.areaSize <= rawForm.maxFlatsCounter!
          );
        }
        if (rawForm.IsAdmin !== 0) {
          flats = flats.filter((flat) => flat.areaSize <= rawForm.IsAdmin!);
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

  fn1() {
    console.log('function1');
  }
  fn2() {
    console.log('function2');
  }
  fn3() {
    console.log('function3');
  }
}
