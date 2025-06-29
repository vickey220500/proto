import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(),importProvidersFrom(BrowserAnimationsModule, MatStepperModule, MatButtonModule,MatFormFieldModule,  BrowserModule,
    ReactiveFormsModule, MatInputModule,CommonModule), provideAnimationsAsync(), provideAnimationsAsync(),provideHttpClient(), provideAnimationsAsync()]
};
