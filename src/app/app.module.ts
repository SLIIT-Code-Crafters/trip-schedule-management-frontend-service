import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninPageComponent } from './components/signin-page/signin-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxSpinnerModule} from "ngx-spinner";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {Interceptor} from "./services/interceptors/Interceptor";

const INTERCEPTORS = [{
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
},
  {
    provide: LocationStrategy, useClass: HashLocationStrategy
  }
];
@NgModule({
  declarations: [AppComponent],
  providers: [INTERCEPTORS],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SigninPageComponent,
    LandingPageComponent,
    SignupComponent,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      closeButton: true,
      maxOpened: 10,
      progressBar: true,
      timeOut: 2000
    }),
    NgxSpinnerModule
  ],
})
export class AppModule {}
