import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: "flat-finder-b4591",
        appId: "1:624544131282:web:efd0a5735b0842d8f9a50b",
        storageBucket: 'flat-finder-b4591.appspot.com',
        apiKey: 'AIzaSyDNaTqWKmyL6RHWYPgRO8sfb2dQJ6SKRe0',
        authDomain: 'flat-finder-b4591.firebaseapp.com',
        messagingSenderId: '624544131282',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideAnimationsAsync(), provideHttpClient(),
  ],
};
