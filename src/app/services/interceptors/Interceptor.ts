import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable,finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class Interceptor implements HttpInterceptor {
  private requestCount = 0;

  constructor(
    private spinner: NgxSpinnerService
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.showSpinner();
    return next.handle(request).pipe(
      finalize(() => {
        this.hideSpinner();
      })
    )
  }
  private showSpinner(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.spinner.show();
    }
  }

  private hideSpinner(): void {
    this.requestCount--;
    if (this.requestCount === 0) {
        this.spinner.hide();
    }
  }

}
