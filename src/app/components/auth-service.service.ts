import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  environment =
    'https://fohtljhhuc.execute-api.ap-southeast-1.amazonaws.com/prod/';

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    const url = `${this.environment}api/v1/private/auth/register?requestId=userreg`;
    return this.http.post(url, data);
  }

  authenticate(data: any): Observable<any> {
    const url = `${this.environment}api/v1/private/auth/authenticate?requestId=userauth`;
    return this.http.post(url, data);
  }

  login(data: any): Observable<any> {
    const url = `${this.environment}api/v1/private/users/login?requestId=userlog`;
    return this.http.post(url, data);
  }
}
