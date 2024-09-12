import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
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
        this.ageValidator(18),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    [this.matching('password', 'confirmPassword')]
  );

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

  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl) => {
      const birthDateValue = control.value;
      if (!birthDateValue) return null;

      const today = new Date();
      const birthDateObj = new Date(birthDateValue);

      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      return age >= minAge ? null : { minAge: true };
    };
  }

  onSubmit(): void {}
}
