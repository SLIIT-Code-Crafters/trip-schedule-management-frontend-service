import { AuthServiceService } from './../auth-service.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  public signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private AuthServiceService: AuthServiceService
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      password: ['', Validators.required],
      salutation: ['MS'],
      role: ['SA'],
      masterToken: ['MT-SYSADMIN'],
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
    this.AuthServiceService.signup(data).subscribe((res) => {
      console.log(res);
    });
  }
}
