import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthServiceService } from './../auth-service.service';
import { Router } from '@angular/router';
import { AppToastService } from 'src/app/services/toastr/toast.service';
@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
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
    private toastService: AppToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  authenticate() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.AuthServiceService.authenticate(data).subscribe((res) => {
      this.authtoken = res.data.token;
      this.login();

      console.log(this.authtoken);
    });
  }

  login() {
    const data = {
      user: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.AuthServiceService.login(this.authtoken, data).subscribe(
      (res) => {
        this.router.navigate(['/register']);
        this.toastService.successMessage('User Login Successfull');
        console.log(res);
        console.log(this.authtoken);
      },
      (error) => {
        this.toastService.errorMessage('user login unsuccessfull');
      }
    );
  }
}
