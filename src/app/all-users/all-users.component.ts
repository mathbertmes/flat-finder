import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
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
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

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

  constructor(private router: Router){}

  // Ensure the observable won't emit null values, falling back to an empty array
  users$: User[] = [];

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'userEmail',
    'birthDate',
    'flatsCounter',
    'IsAdmin',
    'operation',
  ];

  formFilter = new FormGroup({
    firstName: new FormControl(''),
    minAge: new FormControl(0),
    maxAge: new FormControl(0),
    minFlatsCounter: new FormControl(0),
    maxFlatsCounter: new FormControl(0),
    IsAdmin: new FormControl(),
  });

  onFilter() {
    let allUsers: User[] = [];
    this.firestore.getAllUsers().subscribe((users) => {
      if (users) {
        console.log(users);
        const rawForm = this.formFilter.getRawValue();

        if (rawForm.firstName) {
          users = users.filter((user) =>
            user.firstName
              .toUpperCase()
              .includes(rawForm.firstName!.toUpperCase())
          );
        }
        if (rawForm.minAge !== 0) {
          users = users.filter((user) => 1 >= rawForm.minAge!);
        }
        if (rawForm.maxAge !== 0) {
          users = users.filter((user) => 1 <= rawForm.maxAge!);
        }
        if (rawForm.minFlatsCounter !== 0) {
          users = users.filter((user) => 1 >= rawForm.minFlatsCounter!);
        }
        if (rawForm.maxFlatsCounter !== 0) {
          users = users.filter((user) => 1 <= rawForm.maxFlatsCounter!);
        }
        if (rawForm.IsAdmin !== 0) {
          users = users.filter((user) => 1 <= rawForm.IsAdmin!);
        }

        console.log(users);

        this.users$ = users;
      } else {
        allUsers = [];
      }
    });
  }

  handleUserRoleChange(userId: string, role: string){
    const updatedUser = {
      role: role === 'admin' ? 'user' : 'admin',
    };

    this.firestore.updateUser(userId, updatedUser);
  }

  handleRemoveUser(userId: string){
    const updatedUser = {
      deleted: true,
    };

    this.firestore.updateUser(userId, updatedUser);
  }

  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }

  ngOnInit(): void {
    if(localStorage.getItem("userRole") !== "admin"){
      window.location.replace("/")
      return 
    }
    this.firestore.getAllUsers().subscribe((users) => {
      if (users) {
        this.users$ = users;
      } else {
        this.users$ = [];
      }
    });
  }

  storedData: any = localStorage.getItem('user');
  userData = JSON.parse(this.storedData);

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
