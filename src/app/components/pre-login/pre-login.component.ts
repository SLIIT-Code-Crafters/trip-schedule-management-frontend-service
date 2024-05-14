import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-pre-login',
  standalone: true,
  templateUrl: './pre-login.component.html',
  imports: [
    RouterOutlet,
  ],
  styleUrls: ['./pre-login.component.scss']
})
export class PreLoginComponent {

}
