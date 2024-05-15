import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, finalize, Observable, throwError} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommonFunctionsService} from "../common/common-functions.service";
import {LocalStorageService} from "../storage/local-storage.service";


@Injectable()
export class Interceptor implements HttpInterceptor {
  private requestCount = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private commonService: CommonFunctionsService,
    private storageService: LocalStorageService,
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.showSpinner();
    if (this.storageService.getToken()) {
      request = this.addToken(request, this.storageService.getToken());
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.hideSpinner();
      })
    ).pipe(
      catchError(error => {
        
        return throwError(error);
      }));
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

  private logOut(): void {
    this.storageService.clearSessionStorage();
  }

  private addToken(request: HttpRequest<any>, token: string) {
    if (!request.headers.get('Authorization') &&
      !(request.url.includes('/auth/authenticate') ||
        request.url.includes('/auth/register') ||
        request.url.includes('/users/get-by-email') ||
        request.url.includes('/auth/activate'))) {
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    } else {
      return request;
    }
  }

}
