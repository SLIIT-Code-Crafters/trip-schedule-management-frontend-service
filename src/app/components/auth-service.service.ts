import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStroage } from 'src/component/local-storage';

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

  activation(email: any, code: any) {
    const url = `${this.environment}api/v1/private/auth/activate?email=${email}&activationCode=${code}&requestId=accountActivationReq`;
    const payload = {
      email: email,
      activationCode: code,
    };

    return this.http.put(url, payload);
  }

  login(token: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.environment}api/v1/private/users/login?requestId=userlog`;
    return this.http.post(url, data, { headers });
  }

  userDetails(email: string): Observable<any> {
    const authToken = localStorage.getItem(
      LocalStroage.authToken
    ) as string;
    const url = `${this.environment}api/v1/private/users/get-by-email/${email}?requestId=userDetails`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.get(url, { headers });
  }
}
