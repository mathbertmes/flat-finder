import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  inject,
  signal,
  ChangeDetectionStrategy,
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
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BehaviorSubject, merge } from 'rxjs';
import { FirestoreService } from '../firestore.service';
import { Flat } from '../interfaces/flat.interface';

@Component({
  selector: 'app-edit-flat',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgIf,],
    providers: [provideNativeDateAdapter()],
  templateUrl: './edit-flat.component.html',
  styleUrl: './edit-flat.component.css'
})
export class EditFlatComponent implements OnInit {
  flatId: string | null = null;
  flat = new BehaviorSubject<Flat | undefined>(undefined);
  flat$ = this.flat.asObservable();
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  firestore = inject(FirestoreService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.flatId = params.get('id');
      console.log('Flat ID:', this.flatId);
      if (this.flatId) {
  
        this.firestore.getFlat(this.flatId).subscribe({
          next: (flat) => {
      
            if (flat) {
              this.flat.next(flat)
              this.initializeForm(flat);
              console.log('User data loaded:', this.flat$);
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
    })

  }

  initializeForm(flat: Flat): void {
    this.form.patchValue({ 
      city: flat.city,
      areaSize: flat.areaSize,
      dataAvailable: flat.dataAvailable,
      hasAc: flat.hasAc ? "true" : "false",
      rentPrice: flat.rentPrice,
      streetNumber: flat.streetNumber,
      yearBuild: flat.yearBuild

    });
  }

  form = new FormGroup({
    city: new FormControl('', [Validators.required]),
    streetNumber: new FormControl(0, [Validators.required]),
    areaSize: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    hasAc: new FormControl("false", [Validators.required]),
    yearBuild: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    rentPrice: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    dataAvailable: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
  });

  get city() {
    return this.form.get('city');
  }

  get streetNumber() {
    return this.form.get('streetNumber');
  }

  get areaSize() {
    return this.form.get('areaSize');
  }
  get hasAc() {
    return this.form.get('hasAc');
  }

  get yearBuild() {
    return this.form.get('yearBuild');
  }
  get rentPrice() {
    return this.form.get('rentPrice');
  }

  get dataAvailable() {
    return this.form.get('dataAvailable');
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    const userId = localStorage.getItem('userId');
    const userFullName = localStorage.getItem('userFullName');
    const userEmail = localStorage.getItem('userEmail');
    if (
      rawForm.city &&
      rawForm.streetNumber &&
      rawForm.areaSize &&
      rawForm.hasAc &&
      rawForm.yearBuild &&
      rawForm.rentPrice &&
      rawForm.dataAvailable &&
      userId &&
      userFullName &&
      userEmail
    ) {
      const newFlat = {
        userId,
        userFullName,
        userEmail,
        city: rawForm.city,
        streetNumber: rawForm.streetNumber,
        areaSize: rawForm.areaSize,
        hasAc: rawForm.hasAc === 'true' ? true : false,
        yearBuild: rawForm.yearBuild,
        rentPrice: rawForm.rentPrice,
        dataAvailable: rawForm.dataAvailable,
      };

      this.firestore.updateFlat(this.flatId!, newFlat);
    }
    this.router.navigateByUrl('/my-flats');
  }

  cityErrorMessage = signal('');
  streetNumberErrorMessage = signal('');
  areaSizeErrorMessage = signal('');
  hasAcErrorMessage = signal('');
  yearBuildErrorMessage = signal('');
  rentPriceErrorMessage = signal('');
  dataAvailableErrorMessage = signal('');


  updateCityErrorMessage() {
    if (this.city!.hasError('required')) {
      this.cityErrorMessage.set('You must enter a value');
    } else {
      this.cityErrorMessage.set('');
    }
  }

  updateStreetNumberErrorMessage() {
    if (this.streetNumber!.hasError('required')) {
      this.streetNumberErrorMessage.set('You must enter a value');
    } else {
      this.streetNumberErrorMessage.set('');
    }
  }

  updateAreaSizeErrorMessage() {
    if (this.areaSize!.hasError('required')) {
      this.areaSizeErrorMessage.set('You must enter a value');
    } else if (this.areaSize!.hasError('pattern')) {
      this.areaSizeErrorMessage.set('Area Size must be a number.');
    } else {
      this.areaSizeErrorMessage.set('');
    }
  }

  updateHasAcErrorMessage() {
    if (this.hasAc!.hasError('required')) {
      this.hasAcErrorMessage.set('You must enter a value');
    } else {
      this.hasAcErrorMessage.set('');
    }
  }

  updateYearBuildErrorMessage() {
    if (this.yearBuild!.hasError('required')) {
      this.yearBuildErrorMessage.set('You must enter a value');
    } else if (this.yearBuild!.hasError('pattern')) {
      this.yearBuildErrorMessage.set('Year Build must be a number.');
    } else {
      this.yearBuildErrorMessage.set('');
    }
  }

  updateRentPriceErrorMessage() {
    console.log(this.rentPrice?.errors);
    if (this.rentPrice!.hasError('required')) {
      this.rentPriceErrorMessage.set('You must enter a value');
    } else if (this.rentPrice!.hasError('pattern')) {
      this.rentPriceErrorMessage.set('Rent Price must be a number.');
    } else {
      this.rentPriceErrorMessage.set('');
    }
  }

  updateDataAvailableErrorMessage() {
    if (this.dataAvailable!.hasError('required')) {
      this.dataAvailableErrorMessage.set('You must enter a value');
    } else {
      this.dataAvailableErrorMessage.set('');
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
