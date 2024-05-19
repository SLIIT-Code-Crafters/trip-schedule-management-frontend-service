import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionsService } from '../services/common/common-functions.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  emailSubmitted: boolean = false;
  showOtpForm: boolean = false;
  registeredEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private commonFunctionsService: CommonFunctionsService,
    
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmitEmail(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.registeredEmail = email;
      
      // Construct the API endpoint URL with the email as a query parameter
      const apiUrl = `https://fohtljhhuc.execute-api.ap-southeast-1.amazonaws.com/prod/api/v1/private/auth/forgot-password/send-otp?email=${email}&requestId=111`;
      
      this.http.post<any>(apiUrl, {}).subscribe(
        response => {
          // Handle successful response from the API
          console.log('API Response:', response);
          
          this.commonFunctionsService.showAlertSuccess('OTP sent successfully, please check your email.');
          
          // After showing the message, display the OTP form
          setTimeout(() => {
            this.showOtpForm = true;
            this.emailSubmitted = true;
          }, 1000); // Show OTP form after 2 seconds
        },
        error => {
          // Handle error response from the API
          console.error('API Error:', error.error.message);
          this.commonFunctionsService.showAlertError(error.error.message);
        }  
      );
    }
  }

  onSubmitOtp(): void {
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      const newPassword = this.otpForm.value.newPassword;

      // Construct the API endpoint URL
      const apiUrl = 'https://fohtljhhuc.execute-api.ap-southeast-1.amazonaws.com/prod/api/v1/private/auth/forgot-password/reset?requestId=111';

      // Prepare the request body
      const requestBody = {
        email: this.registeredEmail,
        otp: otp,
        newPassword: newPassword
      };

      // Make an HTTP POST request to your API endpoint
      this.http.post<any>(apiUrl, requestBody).subscribe(
        response => {
          // Handle successful response from the API
          console.log('API Response:', response);
          
          this.commonFunctionsService.showAlertSuccess('Password reset successfully.');

          // Reset the form states and hide the OTP form
          this.otpForm.reset();
          this.forgotPasswordForm.reset();
          this.showOtpForm = false;
          this.emailSubmitted = false;
          
          // Redirect to login page after successful password reset
          setTimeout(() => {
            this.router.navigate(['/pre-log/login']);
          }, 1000); // Redirect after 2 seconds
        },
        error => {
          // Handle error response from the API
          console.error('API Error:', error);
          // Show error message using Toastr or any other method
          this.commonFunctionsService.showAlertError(error.error.message);
        }
       
      );
    }
  }
}
