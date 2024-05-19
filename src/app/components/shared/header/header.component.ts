import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from "@angular/router";
import {LocalStorageService} from "../../../services/storage/local-storage.service";
import {User} from "../../../model/User";
import {USER_ROLE_ADMINISTRATOR, USER_ROLE_ORGANIZER} from "../../../utility/common/common-constant";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  protected user: User | null = null;

  constructor(
    private router: Router,
    private storageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.user = this.storageService.getUserSession();
  }

  tripCategory(): void {
    this.router.navigate(['/post-log/admin/sysadmin-category']);
  }

  siteContent(): void {
    this.router.navigate(['/post-log/admin/site-content']);
  }

  login(): void {
    this.router.navigate(['/pre-log/login']);
  }

  register(): void {
    this.router.navigate(['/pre-log/register']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  tripOrganize() {
    this.router.navigate(['/post-log/organize']);
  }

  logout() {
    this.storageService.clearSessionStorage();
    this.user = this.storageService.getUserSession();
    this.router.navigate(['/']);
  }

  protected readonly USER_ROLE_ADMINISTRATOR = USER_ROLE_ADMINISTRATOR;
  protected readonly USER_ROLE_ORGANIZER = USER_ROLE_ORGANIZER;
}
