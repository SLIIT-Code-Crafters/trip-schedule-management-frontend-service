import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {CommonModule, DatePipe} from "@angular/common";
import {TripCategory} from "../../../../../../interfaces/trip-category/TripCategory";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AdminService} from "../../../../../../services/admin/admin.service";
import {CommonFunctionsService} from "../../../../../../services/common/common-functions.service";
import {AppToastService} from "../../../../../../services/toastr/toast.service";
import {ADD_TASK, DATE_FORMAT_1, UPDATE_TASK, VIEW_TASK} from "../../../../../../utility/common/common-constant";
import {SUCCESS_CODE} from "../../../../../../utility/common/response-code";
import {LocalStorageService} from "../../../../../../services/storage/local-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal-crud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './modal-crud.component.html',
  styleUrls: ['./modal-crud.component.scss']
})
export class ModalCrudComponent implements OnInit {

  openedTask: string = '';
  data: TripCategory | null = null;
  @Output() passEntry: EventEmitter<boolean> = new EventEmitter();

  modalForm: FormGroup;
  modalLabel: string = '';

  private logUserEmail:string = '';

  constructor(
    protected activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private adminService: AdminService,
    private commonService: CommonFunctionsService,
    private toastService: AppToastService,
    private storageService: LocalStorageService,
    private router: Router,
  ) {
    this.modalForm = formBuilder.group({
      id: [null, [Validators.required, commonService.noWhitespaceValidator]],
      code: [null, [Validators.required, commonService.noWhitespaceValidator]],
      name: [null, [Validators.required, commonService.noWhitespaceValidator]],
      description: [null, [Validators.required, commonService.noWhitespaceValidator]],
      addedDate: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if(this.storageService.getUserSession() && this.storageService.getUserSession()?.email) {
      this.logUserEmail = this.storageService.getUserSession()?.email!;
      this._setModalCustomized();
      this._setDataToFrom();
    }else{
      this.storageService.clearSessionStorage();
      this.router.navigate(['/']);
    }
  }

  private _setDataToFrom() {
    // this modal open for Update Or View, then assign values
    if (this.openedTask != ADD_TASK && this.data) {
      this.modalForm.patchValue({
        id: this.data.id,
        code: this.data.code,
        name: this.data.name,
        description: this.data.description,
        addedDate: this.datePipe.transform(this.data.createdDate, DATE_FORMAT_1),
      });
    }
  }

  private _setModalCustomized() {
    switch (this.openedTask) {
      case ADD_TASK:
        this.modalLabel = 'Add';
        this.getFormId?.clearValidators();
        this.getFormAddedDate?.clearValidators();
        this.getFormAddedDate?.disable();
        break;
      case UPDATE_TASK:
        this.modalLabel = 'Update';
        this.getFormId?.disable();
        this.getFormCode?.disable();
        this.getFormAddedDate?.disable();
        this.modalForm?.markAllAsTouched();
        break;
      case VIEW_TASK:
        this.modalLabel = 'View';
        this.modalForm.disable();
        break;
      default:
        break;
    }
  }

  protected submitForm() {
    //mark all field as touched
    this.modalForm.markAllAsTouched();
    //check all data validate and this modal is not view
    if (this.modalForm.valid && this.openedTask && this.openedTask != VIEW_TASK) {
      if (this.openedTask == ADD_TASK) {
        this._addCategory();
      } else if (this.openedTask == UPDATE_TASK && this.data?.id) {
        if (!this._isChangedData()) {
          this.toastService.warningMessage('There is no data changed');
        } else {
          this._updateCategory();
        }
      }
    } else {
      this.toastService.warningMessage('Please fill in the required fields');
    }
  }

  protected _isChangedData(): boolean {
    if (_.isEqual(this.openedTask, UPDATE_TASK)) {
      if (!_.isEqual(this.data?.id, this.getFormId?.value)) {
        return true;
      } else if (!_.isEqual(this.data?.code, this.getFormCode?.value)) {
        return true;
      } else if (!_.isEqual(this.data?.name, this.getFormName?.value)) {
        return true;
      } else if (!_.isEqual(this.data?.description, this.getFormDescription?.value)) {
        return true;
      } else if (!_.isEqual(this.datePipe.transform(this.data?.createdDate, DATE_FORMAT_1),
        this.datePipe.transform(this.getFormAddedDate?.value, DATE_FORMAT_1))) {
        return true;
      }
    }
    return false;
  }

  private _addCategory() {
    this.adminService.createTripCategory({
      code: this.getFormCode?.value.trim(),
      name: this.getFormName?.value.trim(),
      description: this.getFormDescription?.value.trim(),
      createdBy: this.logUserEmail
    }).subscribe({
      next: (res) => {
        if (res.status == SUCCESS_CODE) {
          this.toastService.successMessage(res.message);
          this.passEntry.emit(true);
        } else {
          this.toastService.warningMessage(res.message);
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastService.errorMessage(err.error.message);
        }
      }
    })
  }

  private _updateCategory() {
    this.adminService.updateTripCategory(
      this.data?.id!,
      {
        name: this.getFormName?.value.trim(),
        description: this.getFormDescription?.value.trim(),
        updatedBy: this.logUserEmail,
        status: (this.data?.status) ? this.data?.status : null
      }
    ).subscribe({
      next: (res) => {
        if (res.status == SUCCESS_CODE) {
          this.toastService.successMessage(res.message);
          this.passEntry.emit(true);
        } else {
          this.toastService.warningMessage(res.message);
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastService.errorMessage(err.error.message);
        }
      }
    })
  }

  get getFormId() {
    return this.modalForm.get('id');
  }

  get getFormCode() {
    return this.modalForm.get('code');
  }

  get getFormName() {
    return this.modalForm.get('name');
  }

  get getFormDescription() {
    return this.modalForm.get('description');
  }

  get getFormAddedDate() {
    return this.modalForm.get('addedDate');
  }

  protected readonly ADD_TASK = ADD_TASK;
  protected readonly UPDATE_TASK = UPDATE_TASK;
}
