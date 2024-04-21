import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServiceService } from './../auth-service.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppToastService } from 'src/app/services/toastr/toast.service';
import { LocalStroage } from 'src/component/local-storage';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss'],
})
export class ActivationComponent {
  activationForm: any;
  email!: string;
  public registeredEmail = '';

  constructor(
    private router: Router,
    private AuthServiceService: AuthServiceService,
    private fb: FormBuilder,
    private toastService: AppToastService
  ) {}

  ngOnInit(): void {
    this.activationForm = this.fb.group({
      activationCode: [''],
      email: [''],
    });
    this.registeredEmail = localStorage.getItem(
      LocalStroage.registered_email
    ) as string;
  }

  activate() {
    const activationCode = this.activationForm.get('activationCode')?.value;

    this.AuthServiceService.activation(
      this.registeredEmail,
      activationCode
    ).subscribe(
      (res) => {
        this.toastService.successMessage('Account activation succesfully');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.toastService.errorMessage('Activation Not succesfull');
      }
    );
  }
}
