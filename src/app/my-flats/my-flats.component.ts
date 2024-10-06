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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-flats',
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
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './my-flats.component.html',
  styleUrl: './my-flats.component.css',
})
export class MyFlatsComponent implements OnInit {
  firestore = inject(FirestoreService);

  constructor(private router: Router){}

  // Ensure the observable won't emit null values, falling back to an empty array
  flats$: Flat[] = [];

  userFavoritesFlats: string[] = [];

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
    'favorite',
    'operation',
  ];

  handleFavorite(id: string): void {
    const favoritesList = this.userFavoritesFlats;
    const userId = localStorage.getItem('userId')!;
    if (favoritesList.includes(id)) {
      favoritesList.splice(favoritesList.indexOf(id), 1);
    } else {
      favoritesList.push(id);
    }
    this.userFavoritesFlats = favoritesList;
    localStorage.setItem('userFavorites', JSON.stringify(favoritesList));

    const updatedUser = {
      favorites: favoritesList,
    };

    this.firestore.updateUser(userId, updatedUser);
  }

  openFlatViewPage(flatId: string){
    this.router.navigate(['/flat-view', flatId]);
  }

  storedData: any = localStorage.getItem('user');
  userData = JSON.parse(this.storedData);

  ngOnInit(): void {
    const userFavorites = JSON.parse(localStorage.getItem('userFavorites')!);
    this.userFavoritesFlats = userFavorites;

    const userId = this.userData.id;
    this.firestore.getUserFlats(userId).subscribe((flats) => {
      if (flats) {
        this.flats$ = flats;
      } else {
        this.flats$ = [];
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
