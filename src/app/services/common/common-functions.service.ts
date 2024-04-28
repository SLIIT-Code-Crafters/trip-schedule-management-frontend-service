import { Injectable } from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import {PaginatorData} from "../../interfaces/PaginatorData";

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  constructor() { }

  noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length ? null : {'whitespace': true};
  }

  getDataTableHttpParam(searchMap: Map<string, string>): HttpParams {
    let httpParams = new HttpParams();
    searchMap.forEach((key: string, value: string) => {
      httpParams = httpParams.set(value, key);
    });
    return httpParams;
  }
}
