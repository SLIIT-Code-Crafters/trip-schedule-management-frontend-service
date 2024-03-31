import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'traveltrek-frontEnd';
  showLandingPage: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showLandingPage = false;
      } else if (event instanceof NavigationEnd) {
        // Optionally, you can handle additional logic after navigation ends
      }
    });
  }
}
