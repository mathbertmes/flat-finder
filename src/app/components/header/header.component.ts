import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() public sideNavToggle = new EventEmitter();
  authService = inject(AuthService);
  router = inject(Router);
  localStorage = localStorage;

  constructor() {}
  ngOnInit(): void {}
  onToggleSidenav() {
    // Open and close side nav bar
    this.sideNavToggle.emit();
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('userId');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userEmail');
    this.router.navigateByUrl('/login');
  }
}
