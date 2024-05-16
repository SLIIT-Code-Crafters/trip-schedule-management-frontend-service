import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from "@angular/common";
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MainOptionComponent} from '../main-option/main-option.component';
import {SingleOptionComponent} from "../single-option/single-option.component";
import * as _ from 'lodash';
import {AppToastService} from "../../../../../../services/toastr/toast.service";
import {TripOption} from "../../../../../../interfaces/create-trip/create-trip-option/TripOption";
import {ADD_TASK, UPDATE_TASK, VIEW_TASK} from "../../../../../../utility/common/common-constant";
import {CreateTripOption} from "../../../../../../interfaces/create-trip/create-trip-option/CreateTripOption";

@Component({
  selector: 'app-modal-crud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainOptionComponent,
    SingleOptionComponent
  ],
  providers: [DatePipe],
  templateUrl: './option-modal.component.html',
  styleUrls: ['./option-modal.component.scss']
})
export class OptionModalComponent implements OnInit, OnDestroy {

  @Output() passEntry: EventEmitter<CreateTripOption> = new EventEmitter();

  @ViewChild('addOptionView') addOptionView!: MainOptionComponent;
  openedTask: string = '';

  protected tripOptionSet!: TripOption
  protected modalLabel: string = '';
  protected finalButtonLabel: string = '';

  constructor(
    protected activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastService: AppToastService,
  ) {
  }

  ngOnInit(): void {
    this._setModalCustomized();
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  private _setModalCustomized() {
    switch (this.openedTask) {
      case ADD_TASK.toString():
        this.modalLabel = 'Create New';
        this.finalButtonLabel = 'Save';
        break;
      case UPDATE_TASK.toString():
        this.modalLabel = 'Update';
        this.finalButtonLabel = 'Update';
        break;
      default:
        this.modalLabel = 'Create';
        this.finalButtonLabel = 'Save';
        break;
    }
  }

  clickFinish() {
    this.addOptionView.superFrom.markAllAsTouched();
    if (this.addOptionView.superFrom.valid) {
      if (this._checkValueChanged()) {
        this.passEntry.emit(JSON.parse(JSON.stringify(this.addOptionView.superFrom.getRawValue())));
      } else {
        this.toastService.warningMessage('Please do some change before updating');
      }
    } else {
      this.toastService.warningMessage('Please fill in all mandatory fields');
    }
  }

  clickCancel() {
    this.activeModal.close('click-cancel');
  }

  private _checkValueChanged() {
    if (this.openedTask == ADD_TASK) {
      return true;
    } else return this.openedTask == UPDATE_TASK && !(_.isEqual(this.addOptionView.superFrom.getRawValue(), this.tripOptionSet));
  }

  protected readonly UPDATE_TASK = UPDATE_TASK;

  protected readonly ADD_TASK = ADD_TASK;
}
