import { Component, inject, signal } from '@angular/core';
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
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  form = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      birthDate: new FormControl('', [
        Validators.required,
        this.ageRangeValidator(18, 120),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    [this.matching('password', 'confirmPassword')]
  );

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

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    if (
      (rawForm.email && rawForm.password && rawForm.firstName, rawForm.lastName)
    ) {
      this.authService
        .register(
          rawForm.email!,
          rawForm.password!,
          rawForm.firstName!,
          rawForm.lastName!
        )
        .subscribe(() => {
          this.router.navigateByUrl('/');
        });
    }
  }

  firstNameErrorMessage = signal('');
  lastNameErrorMessage = signal('');
  emailErrorMessage = signal('');
  birthDateErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');

  constructor() {
    merge(this.email!.statusChanges, this.email!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
  }

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
}
