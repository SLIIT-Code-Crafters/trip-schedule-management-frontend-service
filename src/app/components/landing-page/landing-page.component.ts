import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from './../auth-service.service';
import { LocalStroage } from 'src/component/local-storage';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  registeredEmail!: string;
  constructor(
    private router: Router,
    private AuthServiceService: AuthServiceService
  ) {}
  focus: any;
  focus1: any;

  ngOnInit(): void {
    this.registeredEmail = localStorage.getItem(
      LocalStroage.registered_email
    ) as string;

    this.getUserDetails();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.router.navigate(['/register']);
  }
  profile() {
    this.router.navigate(['/profile']);
  }

  getUserDetails() {
    this.AuthServiceService.userDetails(this.registeredEmail).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }
}
