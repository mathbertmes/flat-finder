import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BehaviorSubject, merge } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    CommonModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.css',
})
export class ProfileUpdateComponent {
  userId: string | null = null;
  user = new BehaviorSubject<User | undefined>(undefined);
  user$ = this.user.asObservable();
  firestore = inject(FirestoreService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      console.log('User ID:', this.userId);

      if (this.userId) {
        // Usa o `id` para buscar os dados do usuário
        this.firestore.getUser(this.userId).subscribe({
          next: (user) => {
      
            if (user) {
              this.user.next(user)
              this.initializeForm(user);
              console.log('User data loaded:', this.user$);
            } else {
              console.log('No user data found.');
            }

          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });
      } else {
        console.log('No user ID provided.');
      }
    });
  }

  form = new FormGroup(
    {
      firstName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      birthDate: new FormControl(new Date, [
        Validators.required,
        this.ageRangeValidator(18, 120),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl(''),
      favorites: new FormControl(''),
    },
    [this.matching('password', 'confirmPassword')]
  );

  initializeForm(user: User): void {
    this.form.patchValue({ // Preenche o formulário com os dados do usuário
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate || new Date,
      role: user.role,
    });
  }

  checkSpecialCharacter = () => {};

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }
  get birthDate() {
    return this.form.get('birthDate');
  }

  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  matching(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (control === null) return null;
      if (checkControl === null) return null;
      if (control.value !== checkControl.value) {
        checkControl.setErrors({ matching: true });
        return { matching: true };
      }
      return null;
    };
  }

  ageRangeValidator(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < minAge || age > maxAge) {
        return { ageRange: true };
      }

      return null;
    };
  }

  firstNameErrorMessage = signal('');
  lastNameErrorMessage = signal('');
  emailErrorMessage = signal('');
  birthDateErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');

  updateFirstNameErrorMessage() {
    if (this.firstName!.hasError('required')) {
      this.firstNameErrorMessage.set('You must enter a value');
    } else if (this.firstName!.hasError('minlength')) {
      this.firstNameErrorMessage.set(
        'First must be at least 2 characters long.'
      );
    } else {
      this.firstNameErrorMessage.set('');
    }
  }

  updateLastNameErrorMessage() {
    if (this.lastName!.hasError('required')) {
      this.lastNameErrorMessage.set('You must enter a value');
    } else if (this.lastName!.hasError('minlength')) {
      this.lastNameErrorMessage.set('Last must be at least 2 characters long.');
    } else {
      this.firstNameErrorMessage.set('');
    }
  }

  updateEmailErrorMessage() {
    if (this.email!.hasError('required')) {
      this.emailErrorMessage.set('You must enter a value');
    } else if (this.email!.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updateBirthDateErrorMessage() {
    if (this.birthDate!.hasError('required')) {
      this.birthDateErrorMessage.set('You must enter a value');
    } else if (this.birthDate!.hasError('ageRange')) {
      this.birthDateErrorMessage.set('Age must be in the range of 18-120.');
    } else {
      this.birthDateErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    console.log(this.password?.errors);
    if (this.password!.hasError('required')) {
      this.passwordErrorMessage.set('You must enter a value');
    } else if (this.password!.hasError('minlength')) {
      this.passwordErrorMessage.set(
        'Password must be at least 6 characters long.'
      );
    } else if (this.password?.hasError('pattern')) {
      this.passwordErrorMessage.set(
        'Password must contain at least one special character'
      );
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  updateConfirmPasswordErrorMessage() {
    if (this.confirmPassword!.hasError('required')) {
      this.confirmPasswordErrorMessage.set('You must enter a value');
    } else if (this.confirmPassword!.hasError('matching')) {
      this.confirmPasswordErrorMessage.set(
        'Password and confirm password must be the same.'
      );
    } else {
      this.confirmPasswordErrorMessage.set('');
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    console.log('onSubmit')
    
  }
}
