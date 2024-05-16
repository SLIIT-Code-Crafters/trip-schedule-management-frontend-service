import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-trip-delete-modal-component',
  standalone:true,
  templateUrl: './trip-delete-modal-component.component.html',
  styleUrls: ['./trip-delete-modal-component.component.scss']
})
export class TripDeleteModalComponentComponent implements OnInit {

  constructor(
    protected activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

}
