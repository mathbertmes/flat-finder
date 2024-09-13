import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NewFlatComponent } from './new-flat/new-flat.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'new-flat', component: NewFlatComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
