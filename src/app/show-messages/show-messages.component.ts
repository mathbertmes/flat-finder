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
import { User } from '../interfaces/user.interface';

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
  templateUrl: './show-messages.component.html',
  styleUrl: './show-messages.component.css',
})
export class ShowMessagesComponent implements OnInit {
  messages: any;

  firestore = inject(FirestoreService);

  displayedColumns: string[] = [
    'fromUserFirstName',
    'fromUserLastName',
    'fromUserEmail',
    'content',
    'timestamp',
  ];

  storedData: any = localStorage.getItem('userMessages')!;
  messageData = JSON.parse(this.storedData);

  ngOnInit(): void {
    console.log('Flat Document ID:', this.messageData[0]?.flatDocument);

    // `flatDocument` の値が正しく取得できた場合にクエリを実行
    if (this.messageData[0]?.flatDocument) {
      this.firestore
        .getFlat(this.messageData[0].flatDocument)
        .subscribe((flats) => {
          if (flats && flats.length > 0) {
            this.messages = flats;
            console.log('Flats retrieved:', flats);
          } else {
            this.messages = [];
            console.log('No flats found for the given document ID.');
          }
        });
    } else {
      console.error('No valid flatDocument found in messageData.');
    }
  }
}
