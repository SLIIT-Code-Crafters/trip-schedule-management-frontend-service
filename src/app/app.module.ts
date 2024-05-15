import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from "ngx-spinner";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {Interceptor} from "./services/interceptors/Interceptor";
import {
  TripDeleteModalComponentComponent
} from './components/post-login/organizer/shared/trip-delete-modal-component/trip-delete-modal-component.component';

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
  declarations: [AppComponent, TripDeleteModalComponentComponent],
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
    NgxSpinnerModule
  ],
})
export class AppModule {
}
