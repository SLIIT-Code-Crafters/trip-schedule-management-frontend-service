import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpParams} from "@angular/common/http";
import * as CryptoJS from "crypto-js";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  private SECRET_KEY_ENCRYPT = 'YourSecretKeyForEncryption&Descryption';

  constructor() {
  }

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

  showAlertError(message: string) {
    Swal.fire({
      
      html: message,
      icon: 'error',
      
    })
  }

  showAlertSuccess(message: string) {
    Swal.fire({
     
      html: message,
      icon: 'success',
      
    })
  }

  showAlertWorn(message: string) {
    Swal.fire({
    
      html: message,
      icon: 'warning',
      
    })
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.SECRET_KEY_ENCRYPT.trim()).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.SECRET_KEY_ENCRYPT.trim()).toString(CryptoJS.enc.Utf8);
  }

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/jpeg'});
  }

}
