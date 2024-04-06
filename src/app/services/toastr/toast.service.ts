import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AppToastService {

  constructor(
    private toastr: ToastrService
  ) {
  }

  successMessage(message: string) {
    this.showToast(message, 'success');
  }

  errorMessage(message: string) {
    this.showToast(message, 'error');
  }

  warningMessage(message: string) {
    this.showToast(message, 'warning');
  }

  showToast(message: string, type: string) {
    switch (type) {
      case 'error': {
        this.toastr.error(message, 'Error');
        break;
      }
      case 'warning': {
        this.toastr.warning(message, 'Warning');
        break;
      }
      case 'success': {
        this.toastr.success(message, 'Success');
        break;
      }
    }
  }
}
