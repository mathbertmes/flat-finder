import {
  Component,
  EventEmitter,
  inject,
  Output,
  HostListener,
  OnInit,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NgIf } from '@angular/common';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit{
  isMobile: boolean = false;
  userRole
  

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  @Output() public sideNavToggle = new EventEmitter();
  authService = inject(AuthService);
  router = inject(Router);
  localStorage = localStorage;

  constructor() {
    this.checkWindowSize();
    if(localStorage.getItem("user")){
      const userData: User = JSON.parse(localStorage.getItem("user")!)

    this.userRole = userData.role
    }else{
      this.userRole = undefined
    }
    
  }
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
