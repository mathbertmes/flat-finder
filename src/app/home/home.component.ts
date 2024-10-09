import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { Flat } from '../interfaces/flat.interface';
import { FirestoreService } from '../firestore.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../interfaces/user.interface';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';

const STAR_FILL_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="m243-144 63-266L96-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Z"/></svg>
`;

const STAR_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="m352-293 128-76 129 76-34-144 111-95-147-13-59-137-59 137-147 13 112 95-34 144ZM243-144l63-266L96-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Zm237-333Z"/></svg>
`;

@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort | null = null; 
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null; 
  
  firestore = inject(FirestoreService);
  
  flats$: MatTableDataSource<Flat> = new MatTableDataSource<Flat>([]); // Mudando para MatTableDataSource para usar o sort e o paginator

  userFavoritesFlats: string[] = [];
  userMessages: any;

  storedData: any = localStorage.getItem('user');
  userData = JSON.parse(this.storedData);

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
    'flat-view'
  ];

  formFilter = new FormGroup({
    city: new FormControl(''),
    minPrice: new FormControl(0),
    maxPrice: new FormControl(0),
    minArea: new FormControl(0),
    maxArea: new FormControl(0),
  });

  constructor(private router: Router) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral(
      'star_fill_icon',
      sanitizer.bypassSecurityTrustHtml(STAR_FILL_ICON)
    );
    iconRegistry.addSvgIconLiteral(
      'star_icon',
      sanitizer.bypassSecurityTrustHtml(STAR_ICON)
    );
  }

  ngOnInit(): void {
    const userFavorites = JSON.parse(localStorage.getItem('userFavorites')!);
    this.userFavoritesFlats = userFavorites || [];


    this.firestore.getFlats().subscribe((flats) => {
      this.flats$.data = flats || []
    });
  }

  ngAfterViewInit(): void {
    this.flats$.sort = this.sort;
    this.flats$.paginator = this.paginator;
  }

  openFlatViewPage(flatId: string) {
    this.router.navigate(['/flat-view', flatId]);
  }

  onFilter() {
    this.firestore.getFlats().subscribe((flats) => {
      if (flats) {
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

        // Atualizar os dados filtrados no MatTableDataSource
        this.flats$.data = flats;
      }
    });
  }

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
}