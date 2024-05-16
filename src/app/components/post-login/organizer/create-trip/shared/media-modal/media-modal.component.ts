import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ImageUploaderComponent} from "../image-uploader/image-uploader.component";
import {CommonModule} from "@angular/common";
import {TripMedia} from "../../../../../../interfaces/create-trip/create-trip-option/TripMedia";

@Component({
  selector: 'app-media-modal',
  standalone: true,
  templateUrl: './media-modal.component.html',
  imports: [
    CommonModule,
    ImageUploaderComponent
  ],
  styleUrls: ['./media-modal.component.scss']
})
export class MediaModalComponent implements OnInit {

  openTask:string= '';
  mediaList:TripMedia[] = [];

  constructor(
    protected activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit(): void {

  }

  removeImage(id: string) {

  }
}
