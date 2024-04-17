import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  templateUrl: './delete-content-modal.component.html',
  styleUrls: ['./delete-content-modal.component.scss']
})
export class DeleteContentModalComponent implements OnInit {

  constructor(
      protected activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
