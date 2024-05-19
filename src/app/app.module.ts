import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {Interceptor} from "./services/interceptors/Interceptor";
import {NgxSpinnerModule} from "ngx-spinner";
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
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
  declarations: [AppComponent, ForgotPasswordComponent],
  providers: [INTERCEPTORS],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      closeButton: true,
      maxOpened: 10,
      progressBar: true,
      timeOut: 2000
    }),
    NgxSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AppModule {
}
