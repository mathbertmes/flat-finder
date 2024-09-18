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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
    ]),
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    if (rawForm.email && rawForm.password) {
      this.authService.login(rawForm.email, rawForm.password).subscribe(() => {
        this.router.navigateByUrl('/');
      });
    }
  }

  EmailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  constructor() {
    merge(this.email!.statusChanges, this.email!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
  }

  updateEmailErrorMessage() {
    if (this.email!.hasError('required')) {
      this.EmailErrorMessage.set('You must enter a value');
    } else if (this.email!.hasError('email')) {
      this.EmailErrorMessage.set('Not a valid email');
    } else {
      this.EmailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
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

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
