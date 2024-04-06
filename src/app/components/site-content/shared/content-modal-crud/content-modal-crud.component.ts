import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {CommonFunctionsService} from "../../../../services/common/common-functions.service";
import * as _ from 'lodash';
import {ADD_TASK, DATE_FORMAT_1, UPDATE_TASK, VIEW_TASK} from "../../../../utility/common/common-constant";
import {CommonModule, DatePipe} from "@angular/common";
import {AppToastService} from "../../../../services/toastr/toast.service";
import {NgbActiveModal, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {SiteContent} from "../../../../interfaces/site-content/SiteContent";
import {async} from "rxjs";

@Component({
  selector: 'app-modal-crud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  templateUrl: './content-modal-crud.component.html',
  styleUrls: ['./content-modal-crud.component.scss']
})
export class ContentModalCrudComponent implements OnInit {

  openedTask: string = '';
  data: SiteContent | null = null;
  @Output() passEntry: EventEmitter<SiteContent> = new EventEmitter();

  modalForm: FormGroup;
  modalLabel: string = '';

  todayDate: string = '';
  minDateFromDate: string = '';
  minDateToDate: string = '';

  constructor(
    protected activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private commonService: CommonFunctionsService,
    private toastService: AppToastService,
    private calendar: NgbCalendar,
  ) {
    this.modalForm = formBuilder.group({
      id: [null, [Validators.required, commonService.noWhitespaceValidator]],
      title: [null, [Validators.required, commonService.noWhitespaceValidator]],
      description: [null, [Validators.required, commonService.noWhitespaceValidator]],
      searchText: [null, [Validators.required, commonService.noWhitespaceValidator]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      noOfDay: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]],
    }, {validators: this._toDateGreaterThanFromDateValidator});
  }

  ngOnInit(): void {
    this.todayDate = this.datePipe.transform(new Date(), DATE_FORMAT_1)!.toString();
    this.minDateFromDate = this.todayDate;
    this.minDateToDate = this.todayDate;
    this._setModalCustomized();
    this._setDataToFrom();
  }

  private _setDataToFrom() {
    // this modal open for Update Or View, then assign values
    if (this.openedTask != ADD_TASK && this.data) {
      this.modalForm.patchValue({
        id: this.data.id,
        title: this.data.title,
        description: this.data.description,
        searchText: this.data.searchText,
        fromDate: this.datePipe.transform(this.data.fromDate, DATE_FORMAT_1),
        toDate: this.datePipe.transform(this.data.toDate, DATE_FORMAT_1),
        noOfDay: this.data.noOfDay
      });
    }
  }

  private _valueChangesValidate() {
    this.getFormFromDate?.valueChanges.subscribe(v => {
      if (v) {
        this.minDateToDate = this.datePipe.transform(v, DATE_FORMAT_1)!;
        if(this.datePipe.transform(v, DATE_FORMAT_1)! > this.datePipe.transform(this.getFormToDate?.value, DATE_FORMAT_1)!){
          this.getFormToDate?.reset();
        }
      }else{
        this.minDateToDate = this.todayDate;
        this.minDateFromDate = this.todayDate;
      }
    });
  }

  private _setModalCustomized() {
    switch (this.openedTask) {
      case ADD_TASK.toString():
        this._valueChangesValidate();
        this.modalLabel = 'Add';
        break;
      case UPDATE_TASK.toString():
        this._valueChangesValidate();
        this.modalLabel = 'Update';
        this.getFormId?.disable();
        this.modalForm?.markAllAsTouched();
        break;
      case VIEW_TASK.toString():
        this.modalLabel = 'View';
        this.modalForm.disable();
        break;
      default:
        this.openedTask = VIEW_TASK;
        this.modalLabel = 'View';
        this.modalForm.disable();
        break;
    }
  }

  protected submitForm() {
    //mark all field as touched
    this.modalForm.markAllAsTouched();
    //check all data validate and this modal is not view
    if (this.modalForm.valid && this.openedTask && this.openedTask != VIEW_TASK) {
      if (this.openedTask == ADD_TASK) {
        // this.getFormFormDate?.setValue(this.datePipe.transform(new Date(), DATE_FORMAT_1));
      }
      if (this.openedTask == UPDATE_TASK && !this._isChangedData()) {
        this.toastService.warningMessage('There is no data changed');
      } else {
        this.passEntry.emit(this.modalForm.getRawValue())
      }
    } else {
      this.toastService.warningMessage('Please correctly fill in the fields');
    }
  }

  // checking only update process
  protected _isChangedData(): boolean {
    if (_.isEqual(this.openedTask, UPDATE_TASK)) {
      if (!_.isEqual(this.data?.id, this.getFormId?.value)) {
        return true;
      } else if (!_.isEqual(this.data?.title, this.getFormTitle?.value)) {
        return true;
      } else if (!_.isEqual(this.data?.searchText, this.getFormSearchText?.value)) {
        return true;
      } else if (!_.isEqual(this.data?.description, this.getFormDescription?.value)) {
        return true;
      } else if (!_.isEqual(this.datePipe.transform(this.data?.fromDate, DATE_FORMAT_1),
        this.datePipe.transform(this.getFormFromDate?.value, DATE_FORMAT_1))) {
        return true;
      } else if (!_.isEqual(this.datePipe.transform(this.data?.toDate, DATE_FORMAT_1),
        this.datePipe.transform(this.getFormToDate?.value, DATE_FORMAT_1))) {
        return true;
      } else if (!_.isEqual(this.data?.noOfDay, this.getFormNoOfDay?.value)) {
        return true;
      }
    }
    return false;
  }

  private _toDateGreaterThanFromDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fromDate = this.getFormFromDate?.value;
      const toDate = this.getFormToDate?.value;
      if (fromDate && toDate && toDate < fromDate) {
        return { toDateLessThanFromDate: true };
      }
      return null;
    };
  }

  protected fileChangeFileEvent(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.fileToBase64(file).then(value => {
          console.log(value)
        }).catch(reason => {
          console.log(reason)
        });
    }
  }

  fileToBase64(file:File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
            const result = event.target?.result as string;
            if (result) {
              resolve(result);
            }
          }
      reader.onerror = error => reject(error);
    });
  }


  get getFormId() {
    return this.modalForm.get('id');
  }

  get getFormTitle() {
    return this.modalForm.get('title');
  }

  get getFormSearchText() {
    return this.modalForm.get('searchText');
  }

  get getFormDescription() {
    return this.modalForm.get('description');
  }

  get getFormFromDate() {
    return this.modalForm.get('fromDate');
  }

  get getFormToDate() {
    return this.modalForm.get('toDate');
  }

  get getFormNoOfDay() {
    return this.modalForm.get('noOfDay');
  }

  protected readonly ADD_TASK = ADD_TASK;
  protected readonly UPDATE_TASK = UPDATE_TASK;
  protected readonly VIEW_TASK = VIEW_TASK;
}
