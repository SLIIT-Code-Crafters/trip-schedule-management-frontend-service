import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ENVIRONMENT1, ENVIRONMENT2} from "../../utility/common/common-constant";

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  constructor(private http: HttpClient) {
  }

  signup(data: any): Observable<any> {
    const url = `${ENVIRONMENT1}api/v1/private/auth/register?requestId=userreg`;
    return this.http.post(url, data);
  }

  authenticate(data: any): Observable<any> {
    const url = `${ENVIRONMENT1}api/v1/private/auth/authenticate?requestId=userauth`;
    return this.http.post(url, data);
  }

  activation(email: any, code: any): Observable<any> {
    const url = `${ENVIRONMENT1}api/v1/private/auth/activate?email=${email}&activationCode=${code}&requestId=accountActivationReq`;
    const payload = {
      email: email,
      activationCode: code,
    };
    return this.http.put(url, payload);
  }

  login(token: any, data: any): Observable<any> {
    const url = `${ENVIRONMENT1}api/v1/private/users/login?requestId=userlog`;
    return this.http.post(url, data);
  }

  userDetails(email: string): Observable<any> {
    const url = `${ENVIRONMENT2}api/v1/private/users/get-by-email/${email}?requestId=userDetails`;
    return this.http.get(url);
  }
}
