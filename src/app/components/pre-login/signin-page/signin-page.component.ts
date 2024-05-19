import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {AppToastService} from 'src/app/services/toastr/toast.service';
import {LocalStorageService} from "../../../services/storage/local-storage.service";
import {CommonFunctionsService} from "../../../services/common/common-functions.service";
import {AuthServiceService} from "../../../services/authentication/auth-service.service";
import {NOT_ACTIVATED_CODE, SUCCESS_CODE} from "../../../utility/common/response-code";
import {User} from "../../../model/User";
import {of, switchMap} from "rxjs";
import {UserDetails} from "../../../model/UserDetails";

@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss'],
})
export class SigninPageComponent {
  public loginForm!: FormGroup;
  authtoken: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private AuthServiceService: AuthServiceService,
    private toastService: AppToastService,
    private storageService: LocalStorageService,
    private commonFunctionsService: CommonFunctionsService,
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  authenticate() {
    if (this.loginForm.valid) {
      const data = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };
      this.AuthServiceService.authenticate(data).subscribe({
        next: (res) => {
          if (res.status == SUCCESS_CODE) {
            this.storageService.setToken(res.data.token);
            this.login();
          } else if (res.status == NOT_ACTIVATED_CODE) {
            this.commonFunctionsService.showAlertWorn(res.message);
            let user = new User();
            user.email = this.loginForm.get('email')?.value;
            this.storageService.setUserSession(user);
            this.router.navigate(['/pre-log/activation']);
          } else {
            this.commonFunctionsService.showAlertWorn(res.message);
          }
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.commonFunctionsService.showAlertError(err.error.message);
          }
        }
      });
    }
  }

  login() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.AuthServiceService.login(this.authtoken, data).pipe(
      switchMap((resLogin) => {
        if (resLogin.status == SUCCESS_CODE) {
          return this.AuthServiceService.userDetails(this.loginForm.get('email')?.value);
        } else {
          return of(resLogin);
        }
      })).subscribe({
      next: (resUser) => {
        if (resUser.status == SUCCESS_CODE) {
         
          let userData: UserDetails = resUser.data as UserDetails;
          let user = new User();
          user.email = this.loginForm.get('email')?.value;
          user.activatedUser = true;
          user.userId = (userData.id) ? userData.id : '';
          user.userName = (userData.userName) ? userData.userName : '';
          user.firstName = (userData.firstName) ? userData.firstName : '';
          user.lastName = (userData.lastName) ? userData.lastName : '';
          user.role = (userData.role) ? userData.role : '';
          user.activatedUser = true;
          this.storageService.setUserSession(user);
          this.router.navigate(['/']);
        } else {
          this.commonFunctionsService.showAlertWorn(resUser.message);
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.commonFunctionsService.showAlertError(err.error.message);
        }
      }
    });
  }

  singUp() {
    this.router.navigate(['/pre-log/register'])
  }
}
