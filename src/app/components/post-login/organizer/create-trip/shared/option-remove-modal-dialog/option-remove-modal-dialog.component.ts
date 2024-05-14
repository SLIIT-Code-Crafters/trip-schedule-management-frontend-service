import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  templateUrl: './option-remove-modal-dialog.component.html',
  styleUrls: ['./option-remove-modal-dialog.component.scss']
})
export class OptionRemoveModalDialogComponent implements OnInit {

  constructor(
    protected activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

}
