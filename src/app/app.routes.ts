import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NewFlatComponent } from './new-flat/new-flat.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MyFlatsComponent } from './my-flats/my-flats.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { FlatViewComponent } from './flat-view/flat-view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile-update', component: ProfileUpdateComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'flat-view/:id', component: FlatViewComponent },
  { path: 'new-flat', component: NewFlatComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'my-flats', component: MyFlatsComponent },
  { path: 'delete-account', component: DeleteAccountComponent },
  { path: 'all-users', component: AllUsersComponent },
  { path: '', component: HomeComponent },
];
