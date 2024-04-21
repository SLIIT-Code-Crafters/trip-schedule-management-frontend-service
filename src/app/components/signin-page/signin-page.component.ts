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
import { LocalStroage } from 'src/component/local-storage';
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
      user: [''],
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
      localStorage.setItem(LocalStroage.authToken, res.data?.token);
      this.login();
    });
  }

  login() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.AuthServiceService.login(this.authtoken, data).subscribe(
      (res) => {
        this.router.navigate(['#']);
        this.toastService.successMessage('User Login Successfull');
      },
      (error) => {
        this.toastService.errorMessage('user login unsuccessfull');
      }
    );
  }
}
