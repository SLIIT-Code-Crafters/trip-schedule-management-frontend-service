import {Component} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'traveltrek-frontEnd';
  showLandingPage: boolean = true;

  constructor(private router: Router, private spinner: NgxSpinnerService) {
  }

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
