import {CommonModule, DatePipe} from '@angular/common';
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OptionModalComponent} from '../shared/option-modal/option-modal.component';
import {DatatableComponent, NgxDatatableModule} from '@swimlane/ngx-datatable';
import {
  OptionRemoveModalDialogComponent
} from "../shared/option-remove-modal-dialog/option-remove-modal-dialog.component";
import {HeaderComponent} from "../../../../shared/header/header.component";
import {TripOption} from "../../../../../interfaces/create-trip/create-trip-option/TripOption";
import {AppToastService} from "../../../../../services/toastr/toast.service";
import {ADD_TASK, DATE_FORMAT_1, UPDATE_TASK, VIEW_TASK} from "../../../../../utility/common/common-constant";
import {CreateTripOption} from "../../../../../interfaces/create-trip/create-trip-option/CreateTripOption";
import { MediaModalComponent } from '../shared/media-modal/media-modal.component';
import {CommonFunctionsService} from "../../../../../services/common/common-functions.service";
import {LocalStorageService} from "../../../../../services/storage/local-storage.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    HeaderComponent,
  ],
  providers: [DatePipe],
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss']
})
export class CreateTripComponent implements OnInit, OnDestroy {

  private modalRef: NgbModalRef | undefined;
  @ViewChild('catTable', {static: true}) catTable: DatatableComponent | undefined;
  @ViewChild('actionOne', {static: true}) actionOne: TemplateRef<any> | undefined;

  protected tripCategoryList:{id:string, description:string}[] = [];

  protected columnsWithFeatures: any;
  private dataWithFeatures: TripOption[] = [];
  protected viewDataWithFeatures: CreateTripOption[] = [];

  private todayDate: string = '';
  protected minDateFromDate: string = '';
  protected minDateToDate: string = '';

  searchText: any;

  protected createTripForm: FormGroup;

  protected openTask:string = ADD_TASK;

  constructor(
    private modalService: NgbModal,
    private toastService: AppToastService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private commonService: CommonFunctionsService,
    private storageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.createTripForm = formBuilder.group({
      id: [null, [Validators.required, commonService.noWhitespaceValidator]],
      tripCategoryList: [null, [Validators.required]],
      tripName:  [null, [Validators.required, commonService.noWhitespaceValidator]],
      description:  [null, [Validators.required, commonService.noWhitespaceValidator]],
      fromDate:  [null, [Validators.required]],
      toDate:  [null, [Validators.required]],
      reservationCloseDate:  [null, [Validators.required]],
      finalCancelDate:  [null, [Validators.required]],
      maxParticipantCount:  [null, [Validators.required]],
      advertise_tripName:  [null, [Validators.required, commonService.noWhitespaceValidator]],
      adertise_tripDetails:  [null, [Validators.required, commonService.noWhitespaceValidator]],
      tripOptionList: [null],
      documents:  [null, [Validators.required, commonService.noWhitespaceValidator]],
      documentList: [null],
      status:  [null]
    }, {validators:this.toDateGreaterThanFromDateValidator});
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data)=>{
      this.tripCategoryList = data['categoryList'];
    });
    this.dataWithFeatures = [];
    this.viewDataWithFeatures = [];
    this.todayDate = this.datePipe.transform(new Date(), DATE_FORMAT_1)!.toString();
    this.minDateFromDate = this.todayDate;
    this.minDateToDate = this.todayDate;
    switch (this.openTask) {
      case ADD_TASK:
        this.getFormId?.clearValidators();
        break;
    }

    this._setTableFeatures();
    this.refreshDataSet();
  }

  protected getChangeTripCategory(catVal: string){
    if(catVal){
      this.getFormTripCategoryList?.setValue([catVal]);
    }else{
      this.getFormTripCategoryList?.setValue([]);
    }
    console.log(this.getFormTripCategoryList?.value)
  }

  private _setTableFeatures() {
    this.columnsWithFeatures = [
      {prop: 'id', name: "ID", width: 70, sortable: true},
      {prop: 'displayName', name: "DISPLAY NAME", width: 70, sortable: true},
      {prop: 'optionCount', name: 'OPTION COUNT', sortable: false},
      {
        prop: 'action',
        name: 'ACTION',
        sortable: true,
        cellTemplate: this.actionOne,
        frozenLeft: false,
        width: 130
      }
    ];
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }

  addOption() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalRef = this.modalService.open(OptionModalComponent, {centered: true, backdrop: false, size: 'lg'});
    this.modalRef.componentInstance.openedTask = ADD_TASK;
    this.modalRef.componentInstance.passEntry.subscribe((option: TripOption) => {
      if (option) {
        option.id = Math.random().toString(36).substr(2, 8);
        this.dataWithFeatures.push(option);
        this.refreshDataSet();
        this.toastService.successMessage('Options was added successfully');
        this.modalRef?.close();
      }
    });
  }
  addMedia() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalRef = this.modalService.open(MediaModalComponent, {centered: true, backdrop: false, size: 'lg'});
  }

  viewOption(row: CreateTripOption) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalRef = this.modalService.open(OptionModalComponent, {centered: true, backdrop: false, size: 'lg'});
    this.modalRef.componentInstance.openedTask = VIEW_TASK;
    this.modalRef.componentInstance.tripOptionSet = JSON.parse(JSON.stringify(this.dataWithFeatures.filter(v => v.id == row.id)[0]));
  }

  updateOption(row: CreateTripOption) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalRef = this.modalService.open(OptionModalComponent, {centered: true, backdrop: false, size: 'lg'});
    this.modalRef.componentInstance.openedTask = UPDATE_TASK;
    this.modalRef.componentInstance.tripOptionSet = JSON.parse(JSON.stringify(this.dataWithFeatures.filter(v => v.id == row.id)[0]));
    this.modalRef.componentInstance.passEntry.subscribe((option: TripOption) => {
      if (option) {
        this.dataWithFeatures = this._updateDataList(this.dataWithFeatures, option);
        this.refreshDataSet();
        this.toastService.successMessage('Options was Updated successfully');
        this.modalRef?.close();
      }
    });
  }

  removeOption(row: CreateTripOption) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(OptionRemoveModalDialogComponent, {centered: true, backdrop: false});
    this.modalRef.result.then(result => {
      if (result == 'remove-it') {
        const index = this.dataWithFeatures.findIndex(item => item.id === row.id);
        if (index !== -1) {
          this.dataWithFeatures.splice(index, 1);
          this.refreshDataSet();
          this.toastService.successMessage('Content was deleted successfully')
        }
      }
    }).catch(err => {
    });
  }

  private _updateDataList(dataSet: TripOption[], fieldsToUpdate: Partial<TripOption>) {
    return dataSet.map(obj => obj.id === fieldsToUpdate.id ? {...obj, ...fieldsToUpdate} : obj);
  }

  private refreshDataSet() {
    this.getFormTripOptionList?.setValue(this.dataWithFeatures)
    this.viewDataWithFeatures = this.dataWithFeatures.map(val => {
      let tripOption: CreateTripOption = {
        id: val.id,
        displayName: val.name,
        optionCount: val.tripOptionSelection.length.toString()
      }
      return tripOption;
    });
  }

  protected clickPublish(){
    console.log(this.createTripForm)
  }

  private toDateGreaterThanFromDateValidator(formGroup:FormGroup) {
      const fromDate = formGroup.get('fromDate')?.value;
      const toDate = formGroup.get('toDate')?.value;
      if (fromDate && toDate && toDate < fromDate) {
        return formGroup.get('toDate')?.setErrors({'toDateLessThanFromDate': true});
      }else if(formGroup.get('toDate')?.hasError('toDateLessThanFromDate')){
          return formGroup.get('toDate')?.setErrors(null);
      }
  }

  get getFormId(){
    return this.createTripForm.get('id');
  }

  get getFormTripCategoryList(){
    return this.createTripForm.get('tripCategoryList');
  }

  get getFormTripName(){
    return this.createTripForm.get('tripName');
  }

  get getFormDescription(){
    return this.createTripForm.get('description');
  }

  get getFormFromDate(){
    return this.createTripForm.get('fromDate');
  }

  get getFormToDate(){
    return this.createTripForm.get('toDate');
  }

  get getForm(){
    return this.createTripForm.get('');
  }

  get getFormReservationCloseDate(){
    return this.createTripForm.get('reservationCloseDate');
  }

  get getFormFinalCancelDate(){
    return this.createTripForm.get('finalCancelDate');
  }

  get getFormMaxParticipantCount(){
    return this.createTripForm.get('maxParticipantCount');
  }

  get getFormAdvertise_tripName(){
    return this.createTripForm.get('advertise_tripName');
  }

  get getFormAdertise_tripDetails(){
    return this.createTripForm.get('adertise_tripDetails');
  }

  get getFormTripOptionList(){
    return this.createTripForm.get('tripOptionList');
  }

  get getFormDocuments(){
    return this.createTripForm.get('documents');
  }

  get getFormDocumentList(){
    return this.createTripForm.get('documentList');
  }

  get getFormStatus(){
    return this.createTripForm.get('status');
  }
}
