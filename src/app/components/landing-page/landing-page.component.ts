import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {LocalStorageService} from "../../services/storage/local-storage.service";
import {HeaderComponent} from "../shared/header/header.component";
import {FooterComponent} from "../shared/footer/footer.component";
import {AuthServiceService} from "../../services/authentication/auth-service.service";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  registeredEmail!: string;

  constructor(
    private router: Router,
    private AuthServiceService: AuthServiceService,
    private storageService: LocalStorageService,
  ) {
  }

  focus: any;
  focus1: any;

  ngOnInit(): void {
    this.registeredEmail = this.storageService.getUserSession()?.email as string;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  profile() {
    this.router.navigate(['/auth/profile']);
  }
}
