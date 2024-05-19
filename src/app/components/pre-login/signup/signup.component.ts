import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Router} from '@angular/router';
import {LocalStorageService} from "../../../services/storage/local-storage.service";
import {CommonFunctionsService} from "../../../services/common/common-functions.service";
import {AuthServiceService} from "../../../services/authentication/auth-service.service";
import {SUCCESS_CODE} from "../../../utility/common/response-code";
import {User} from "../../../model/User";
import {
  USER_ROLE_ADMINISTRATOR,
  USER_ROLE_ORGANIZER,
  USER_ROLE_PARTICIPANT
} from "../../../utility/common/common-constant";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  protected signupForm!: FormGroup;
  private authToken: any;
  protected showAdditionalField = false;
  private email!: string;

  constructor(
    private fb: FormBuilder,
    private AuthServiceService: AuthServiceService,
    private router: Router,
    private storageService: LocalStorageService,
    private commonFunctionsService: CommonFunctionsService,
  ) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        contactNumber: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        salutation: ['', Validators.required],
        role: ['', Validators.required],
        masterToken: [''],
      },
      {validator: this.passwordMatchValidator}
    );

    this.signupForm.get('role')?.valueChanges.subscribe((role) => {
      if (role && role === 'SA') {
        this.showAdditionalField = true;
        this.signupForm.get('masterToken')?.addValidators([Validators.required]);
      } else {
        this.showAdditionalField = false;
        this.signupForm.get('masterToken')?.reset();
        this.signupForm.get('masterToken')?.clearValidators();
      }
    });
  }

  signup() {
    if (!this.signupForm.hasError('passwordMismatch')) {
      console.log('in form')
      const data = {
        firstName: this.signupForm.get('firstname')?.value,
        lastName: this.signupForm.get('lastname')?.value,
        email: this.signupForm.get('email')?.value,
        userName: this.signupForm.get('username')?.value,
        salutation: this.signupForm.get('salutation')?.value,
        contactNo: this.signupForm.get('contactNumber')?.value,
        password: this.signupForm.get('password')?.value,
        role: this.signupForm.get('role')?.value,
        masterToken: this.signupForm.get('masterToken')?.value,
      };
      this.AuthServiceService.signup(data).subscribe({
        next: (res) => {
          if (res.status == SUCCESS_CODE) {
            this.commonFunctionsService.showAlertSuccess(res.message);
            this.authToken = res.data.authToken;
            this.storageService.setToken(this.authToken);
            let user: User = new User();
            user.email = res.data.email;
            user.firstName = res.data.firstName;
            user.lastName = res.data.lastName;
            user.role = res.data.role;
            user.masterToken = res.data.masterToken;
            user.activatedUser = false;
            this.storageService.setUserSession(user);
            this.router.navigate(['/pre-log/activation']);
          } else {
            this.commonFunctionsService.showAlertWorn(res.message);
          }
        }, error: (err) => {
          if (err.error && err.error.message) {
            this.commonFunctionsService.showAlertError(err.error.message);
          }
        }
      });
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return {passwordMismatch: true};
    }
    return null;
  }

  login() {
    this.router.navigate(['/pre-log/login']);
  }

  protected readonly USER_ROLE_ORGANIZER = USER_ROLE_ORGANIZER;
  protected readonly USER_ROLE_PARTICIPANT = USER_ROLE_PARTICIPANT;
  protected readonly USER_ROLE_ADMINISTRATOR = USER_ROLE_ADMINISTRATOR;
}
