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
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
@Component({
  selector: 'app-favorites',
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
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  firestore = inject(FirestoreService);

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

  ngOnInit(): void {
    const userFavorites = JSON.parse(localStorage.getItem('userFavorites')!);
    this.userFavoritesFlats = userFavorites;
    console.log(this.userFavoritesFlats);
    this.firestore.getFlats().subscribe((flats) => {
      if (flats) {
        this.flats$ = flats;
      } else {
        this.flats$ = [];
      }
    });
  }
}
