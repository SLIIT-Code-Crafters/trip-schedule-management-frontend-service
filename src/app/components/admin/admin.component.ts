import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./shared/header/header.component";
import {FooterComponent} from "./shared/footer/footer.component";

@Component({
  selector: 'app-admin',
  standalone:true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

}
