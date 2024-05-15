import {Injectable} from '@angular/core';
import {CommonFunctionsService} from "../common/common-functions.service";
import {User} from "../../model/User";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private common: CommonFunctionsService
  ) {
  }

  get(key: string): any {
    return localStorage ? localStorage.getItem(key) : null;
  }

  set(key: string, value: any): void {
    if (localStorage) {
      localStorage.setItem(key, value);
    }
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getToken(): string {
    try {
      let session = sessionStorage.getItem('token')!;
      return session;
    } catch (ex) {
      return '';
    }
  }

  setUserSession(user: User): void {
    try {
      if (user != null) {
        sessionStorage.setItem('user', this.common.encrypt(JSON.stringify(user)));
      }
    } catch (e) {
    }
  }

  getUserSession(): User | null {
    try {
      let user: User = JSON.parse(this.common.decrypt(sessionStorage.getItem('user')!)) as User;
      return user;
    } catch (e) {
      return null;
    }

  }

  clearSessionStorage() {
    sessionStorage.clear();
  }
}
