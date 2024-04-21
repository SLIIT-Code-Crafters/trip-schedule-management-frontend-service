import { AuthServiceService } from './../auth-service.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppToastService } from 'src/app/services/toastr/toast.service';
import { Router } from '@angular/router';
import { LocalStroage } from 'src/component/local-storage';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  public signupForm!: FormGroup;
  authToken: any;
  showAdditionalField = false;
  email!: string;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private AuthServiceService: AuthServiceService,
    private toastService: AppToastService,
    private router: Router
  ) {}
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
        salutation: [''],
        role: [''],
        masterToken: [''],
      },
      { validator: this.passwordMatchValidator }
    );

    this.signupForm.get('role')?.valueChanges.subscribe((role) => {
      this.showAdditionalField = role === 'SA'; // Show the additional field if role is 'SA'
    });
  }

  signup() {
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
    this.AuthServiceService.signup(data).subscribe(
      (res) => {
        this.toastService.successMessage('user registered successfully');
        this.router.navigate(['/activation']);
        this.authToken = res.data.authToken;
        console.log(this.email);
        localStorage.setItem(LocalStroage.registered_email, res.data?.email);
        this.email = res.data.email;
      },
      (error) => {
        this.toastService.errorMessage('user registration unsuccessful');
      }
    );
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
