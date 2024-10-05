import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Flat } from '../interfaces/flat.interface';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common'; // Import CommonModule for async pipe
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../interfaces/user.interface';
import { Message } from '../interfaces/message.interface';

const STAR_FILL_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="m243-144 63-266L96-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Z"/></svg>
`;

const STAR_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="m352-293 128-76 129 76-34-144 111-95-147-13-59-137-59 137-147 13 112 95-34 144ZM243-144l63-266L96-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Zm237-333Z"/></svg>
`;

@Component({
  selector: 'app-flat-view',
  standalone: true,
  imports: [MatTableModule,
    CommonModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,],
  templateUrl: './flat-view.component.html',
  styleUrl: './flat-view.component.css'
})
export class FlatViewComponent implements OnInit{
  flatId: string | null = null
  flat: Flat[] = [];
  flatMessages: Message[] = [];
  flatOwner: string = ''
  userFavoritesFlats: string[] = [];
  firestore = inject(FirestoreService);
  user: User | null = JSON.parse(localStorage.getItem('user')!);

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

  displayedColumnsMessage: string[] = [
    'messageContent',
    'userFullName',
    'date',
    
  ];

  formMessage = new FormGroup({
    message: new FormControl('', Validators.required),
  });

  constructor(private route: ActivatedRoute,
    private firestoreService: FirestoreService ){
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

  get message() {
    return this.formMessage.get('message');
  }

  onSubmitMessage(){
    const rawForm = this.formMessage.getRawValue();
    if(rawForm.message){
      const newMessage: Message = {
        userId: this.user?.uid!,
        userEmail: this.user?.email!,
        createdAt: new Date,
        flatId: this.flatId!,
        userFullName: `${this.user?.firstName} ${this.user?.lastName}`,
        content: rawForm.message
        
      };

      this.firestoreService.createMessage(newMessage);
    }
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

  ngOnInit(): void {
    const userFavorites = JSON.parse(localStorage.getItem('userFavorites')!);
    this.userFavoritesFlats = userFavorites;
    this.route.paramMap.subscribe(params => {
      this.flatId = params.get('id');
      console.log(this.flatId )
      if (this.flatId) {

        this.firestoreService.getFlat(this.flatId).subscribe(flat => {
          if(flat){
            this.flatOwner = flat.userId
            this.flat = [flat];
            if(this.user?.uid === flat.userId){
              this.firestoreService.getFlatMessages(this.flatId!).subscribe(messages => {
                this.flatMessages = messages
              })
            }else{
              this.firestoreService.getFlatMessagesByUser(this.flatId!, this.user?.uid!).subscribe(messages => {
                this.flatMessages = messages
              })
            }
          }
          
        })
      }
    });
  }
}
