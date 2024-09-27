import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css',
})
export class DeleteAccountComponent {
  authService = inject(AuthService);

  deleteAccount() {
    console.log('delete account');
  }
}
