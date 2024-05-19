import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthServiceService} from "../../../services/authentication/auth-service.service";
import {CommonFunctionsService} from "../../../services/common/common-functions.service";
import {LocalStorageService} from "../../../services/storage/local-storage.service";
import {SUCCESS_CODE} from "../../../utility/common/response-code";
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss'],
})
export class ActivationComponent {
  activationForm: any;
  protected registeredEmail = '';

  constructor(
    private router: Router,
    private AuthServiceService: AuthServiceService,
    private fb: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private storageService: LocalStorageService,
  ) {
    this.activationForm = this.fb.group({
      activationCode: ['', [Validators.required, commonFunctionsService.noWhitespaceValidator]],
    });
  }

  ngOnInit(): void {
    const user = this.storageService.getUserSession();
    if (user && user.email) {
      this.registeredEmail = user.email;
    } else {
      // this.router.navigate(['/']);
    }
  }

  protected activate() {
    const activationCode = this.activationForm.get('activationCode')?.value;
    this.AuthServiceService.activation(
      this.registeredEmail,
      activationCode
    ).subscribe({
        next: (res) => {
          if (res.status == SUCCESS_CODE) {
            this.commonFunctionsService.showAlertSuccess(res.message);
            this.storageService.clearSessionStorage();
            this.router.navigate(['/pre-log/login']);
          } else {
            this.commonFunctionsService.showAlertWorn(res.message);
          }
        }, error: (err) => {
          if (err.error && err.error.message) {
            this.commonFunctionsService.showAlertError(err.error.message);
          }
        }
      }

    );
  }
}
