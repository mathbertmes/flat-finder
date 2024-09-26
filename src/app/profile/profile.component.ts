import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { Flat } from '../interfaces/flat.interface';
import { FirestoreService } from '../firestore.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ProfileUpdateComponent } from '../profile-update/profile-update.component';
import { log } from 'console';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatPaginator,
    MatPaginatorModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    ProfileUpdateComponent,
  ], // Add CommonModule
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  localStorage = localStorage;
  firstName: string = '';
  lastName: string = '';

  firestore = inject(FirestoreService);

  // Ensure the observable won't emit null values, falling back to an empty array
  flats$: Flat[] = [];

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'userEmail',
    'birthDate',
    'edit',
  ];

  ngOnInit(): void {
    this.firestore.getFlats().subscribe((flats) => {
      if (flats) {
        this.flats$ = flats;
      } else {
        this.flats$ = [];
      }
    });
  }

  storedData: any = localStorage.getItem('user');
  userData = JSON.parse(this.storedData);

  fn1() {
    console.log('function1');
  }
}
