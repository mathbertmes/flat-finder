import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { FirestoreService } from '../firestore.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
  @ViewChild(MatSort) sort: MatSort | null = null; 
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null; 

  constructor(private router: Router){}


  users$: MatTableDataSource<User> = new MatTableDataSource<User>([]);

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
    this.firestore.getAllUsers().subscribe((users) => {
      if (users) {
        const rawForm = this.formFilter.getRawValue();
        const currentDate = new Date();
  
        // Filtro por nome
        if (rawForm.firstName) {
          users = users.filter((user) =>
            user.firstName.toUpperCase().includes(rawForm.firstName!.toUpperCase())
          );
        }
  
        // Filtro por idade mínima
        if (rawForm.minAge !== 0) {
          users = users.filter((user) => {
            const birthDate = new Date(user.birthDate);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            const isOldEnough = currentDate.getMonth() > birthDate.getMonth() || 
              (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
            
            return (isOldEnough ? age : age - 1) >= rawForm.minAge!;
          });
        }
  
        // Filtro por idade máxima
        if (rawForm.maxAge !== 0) {
          users = users.filter((user) => {
            const birthDate = new Date(user.birthDate);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            const isOldEnough = currentDate.getMonth() > birthDate.getMonth() || 
              (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
            
            return (isOldEnough ? age : age - 1) <= rawForm.maxAge!;
          });
        }
  
        // Filtro por flatsCounter mínimo
        if (rawForm.minFlatsCounter !== 0) {
          users = users.filter((user) => user.flatsCounter >= rawForm.minFlatsCounter!);
        }
  
        // Filtro por flatsCounter máximo
        if (rawForm.maxFlatsCounter !== 0) {
          users = users.filter((user) => user.flatsCounter <= rawForm.maxFlatsCounter!);
        }
  
        // Atualiza a tabela com os usuários filtrados
        this.users$.data = users;
        console.log(users);
  
      } else {
        this.users$.data = [];
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
        this.users$.data = users;
      } else {
        this.users$.data = [];
      }
    });
  }

  ngAfterViewInit(): void {
    // Conectando sort e paginator ao MatTableDataSource
    this.users$.sort = this.sort;
    this.users$.paginator = this.paginator;
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
