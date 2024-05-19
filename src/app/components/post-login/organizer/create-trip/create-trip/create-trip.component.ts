import {CommonModule, DatePipe} from '@angular/common';
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
import {MediaModalComponent} from '../shared/media-modal/media-modal.component';
import {CommonFunctionsService} from "../../../../../services/common/common-functions.service";
import {LocalStorageService} from "../../../../../services/storage/local-storage.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {OrganizerService} from "../../../../../services/organizer/organizer.service";
import {User} from "../../../../../model/User";
import {TripCreateRequest} from "../../../../../interfaces/request/TripCreateRequest";
import {SUCCESS_CODE} from "../../../../../utility/common/response-code";
import {OrganizedTrip} from "../../../../../interfaces/create-trip/OrganizedTrip";

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    HeaderComponent,
    RouterLink,
  ],
  providers: [DatePipe],
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss']
})
export class CreateTripComponent implements OnInit, OnDestroy {

  private modalRef: NgbModalRef | undefined;
  @ViewChild('catTable', {static: true}) catTable: DatatableComponent | undefined;
  @ViewChild('actionOne', {static: true}) actionOne: TemplateRef<any> | undefined;

  protected tripCategoryList: { id: string, description: string }[] = [];

  protected columnsWithFeatures: any;
  private dataWithFeatures: TripOption[] = [];
  protected viewDataWithFeatures: CreateTripOption[] = [];

  private todayDate: string = '';
  protected minDateFromDate: string = '';
  protected minDateToDate: string = '';

  protected mediaFileList: File[] = [];

  searchText: any;

  protected createTripForm: FormGroup;

  private selectedTripCatValue: { id: string }[] = [];

  protected openTask: string = ADD_TASK;
  protected organizedTripDataSet: OrganizedTrip | null = null;

  constructor(
    private modalService: NgbModal,
    private toastService: AppToastService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private commonService: CommonFunctionsService,
    private storageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private organizerService: OrganizerService,
  ) {
    this.createTripForm = formBuilder.group({
      id: [null, [Validators.required]],
      tripCategoryList: ['', [Validators.required]],
      tripName: [null, [Validators.required, commonService.noWhitespaceValidator]],
      description: [null, [Validators.required, commonService.noWhitespaceValidator]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      reservationCloseDate: [null, [Validators.required]],
      finalCancelDate: [null, [Validators.required]],
      maxParticipantCount: [null, [Validators.required]],
      advertise_tripName: [null, [Validators.required, commonService.noWhitespaceValidator]],
      adertise_tripDetails: [null, [Validators.required, commonService.noWhitespaceValidator]],
      tripOptionList: [null],
      documents: [null],
      documentList: [null],
      status: [null]
    }, {validators: this.toDateGreaterThanFromDateValidator});

    try {
      const navData = this.router.getCurrentNavigation()?.extras.state as { task: string, data: OrganizedTrip };
      if (navData && navData.task) {
        this.openTask = navData.task;
        this.organizedTripDataSet = navData.data;
      } else {
        this.router.navigate(['/post-log/organize'])
      }
    } catch (e) {
      this.router.navigate(['/post-log/organize'])
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.tripCategoryList = data['categoryList'];
    });
    this.getFormTripCategoryList?.valueChanges.subscribe(val => {
      this.selectedTripCatValue = [];
      if (val) {
        this.selectedTripCatValue.push({id: val});
      }
    })
    this.dataWithFeatures = [];
    this.viewDataWithFeatures = [];
    this.todayDate = this.datePipe.transform(new Date(), DATE_FORMAT_1)!.toString();
    this.minDateFromDate = this.todayDate;
    this.minDateToDate = this.todayDate;
    switch (this.openTask) {
      case ADD_TASK:
        this.getFormId?.clearValidators();
        break;
      case UPDATE_TASK:
      case VIEW_TASK:
        this.createTripForm.patchValue({
          id: this.organizedTripDataSet?.id,
          tripCategoryList: this.organizedTripDataSet?.tripCategoryList.map(v => v.id)[0],
          tripName: this.organizedTripDataSet?.tripName,
          description: this.organizedTripDataSet?.description,
          fromDate: this.datePipe.transform(this.organizedTripDataSet?.fromDate, DATE_FORMAT_1)!,
          toDate: this.datePipe.transform(this.organizedTripDataSet?.toDate, DATE_FORMAT_1)!,
          reservationCloseDate: this.datePipe.transform(this.organizedTripDataSet?.reservationCloseDate, DATE_FORMAT_1)!,
          finalCancelDate: this.datePipe.transform(this.organizedTripDataSet?.finalCancelDate, DATE_FORMAT_1)!,
          maxParticipantCount: this.organizedTripDataSet?.maxParticipantCount,
          advertise_tripName: this.organizedTripDataSet?.advertise_tripName,
          adertise_tripDetails: this.organizedTripDataSet?.adertise_tripDetails,
          tripOptionList: this.organizedTripDataSet?.tripOptionList,
          documentList: this.organizedTripDataSet?.documentList,
        });
        this.dataWithFeatures = this.organizedTripDataSet?.tripOptionList!;
        this.refreshDataSet();
        if (this.openTask == VIEW_TASK) {
          this.createTripForm.disable();
        }
        break;
    }
    this._setTableFeatures();
    this.refreshDataSet();
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

  private callUpdateOption(option: TripOption, updateType:string) {
    const user: User | null = this.storageService.getUserSession();
    const newTripOptionSelection = option.tripOptionSelection.map((subVal: any) => {
      return {name: subVal.name, description: subVal.description, cost: subVal.cost};
    })
    const newOption = {name: option.name, tripOptionSelection: newTripOptionSelection}

    const optionRequest = {
      userDto: {id: user?.userId},
      tripRequest: {
        id: this.organizedTripDataSet?.id,
        tripOptionList: newOption
      }
    }
    this.organizerService.updateOrganizedTripOptions(optionRequest).subscribe({
      next: (res) => {
        if (res.status == SUCCESS_CODE) {
          this.toastService.successMessage(res.message);
          if(updateType == 'new'){
            this.dataWithFeatures.push(option);
          }else if(updateType == 'update'){
            this.dataWithFeatures = this._updateDataList(this.dataWithFeatures, option);
          }
          this.refreshDataSet();
          this.modalRef?.close();
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

  addOption() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalRef = this.modalService.open(OptionModalComponent, {centered: true, backdrop: false, size: 'lg'});
    this.modalRef.componentInstance.openedTask = ADD_TASK;
    this.modalRef.componentInstance.passEntry.subscribe((option: TripOption) => {
      if (option) {
        option.id = Math.random().toString(36).substr(2, 8);
        if (this.openTask == UPDATE_TASK) {
          this.callUpdateOption(option, 'new');
        } else if (this.openTask == ADD_TASK) {
          this.dataWithFeatures.push(option);
          this.modalRef?.close();
          this.refreshDataSet();
        }
      }
    });
  }

  addMedia() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalRef = this.modalService.open(MediaModalComponent, {centered: true, backdrop: false, size: 'lg'});
    this.modalRef.componentInstance.openTask = this.openTask;
    this.modalRef.componentInstance.tripId = this.organizedTripDataSet?.id;
    if (this.openTask == UPDATE_TASK || this.openTask == VIEW_TASK) {
      this.modalRef.componentInstance.mediaList = this.getFormDocumentList?.value;
    }else if(this.openTask == ADD_TASK) {
      this.modalRef.componentInstance.mediaFileList = [...this.mediaFileList];
    }
    this.modalRef.result.then(result => {
      if (result && result.status == 'save-media') {
        if (this.openTask == ADD_TASK || this.openTask == UPDATE_TASK) {
          this.mediaFileList = result.data;
        }
      }
    }).catch(err => {
    });
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
        if (this.openTask == UPDATE_TASK) {
          this.callUpdateOption(option, 'update');
        } else if (this.openTask == ADD_TASK) {
          this.dataWithFeatures = this._updateDataList(this.dataWithFeatures, option);
          this.modalRef?.close();
          this.refreshDataSet();
        }
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
        id: val.id!,
        displayName: val.name,
        optionCount: val.tripOptionSelection.length.toString()
      }
      return tripOption;
    });
  }

  protected clickPublish() {
    if (this.createTripForm.valid) {
      const requestBody = JSON.parse(JSON.stringify((this.createTripForm.getRawValue())));
      requestBody.tripCategoryList = this.selectedTripCatValue;
      requestBody.fromDate = this.datePipe.transform(requestBody.fromDate, 'yyyy-MM-ddTHH:mm:ss.SSS')!;
      requestBody.toDate = this.datePipe.transform(requestBody.toDate, 'yyyy-MM-ddTHH:mm:ss.SSS')!;
      requestBody.reservationCloseDate = this.datePipe.transform(requestBody.reservationCloseDate, 'yyyy-MM-ddTHH:mm:ss.SSS')!;
      requestBody.finalCancelDate = this.datePipe.transform(requestBody.finalCancelDate, 'yyyy-MM-ddTHH:mm:ss.SSS')!;

      requestBody.tripOptionList = requestBody.tripOptionList.map((val: any) => {
        val.tripOptionSelection = val.tripOptionSelection.map((subVal: any) => {
          return {name: subVal.name, description: subVal.description, cost: subVal.cost};
        })
        return {name: val.name, tripOptionSelection: val.tripOptionSelection};
      })

      const user: User | null = this.storageService.getUserSession();
      if (user) {
        const request: TripCreateRequest = {
          userDto: {id: user?.userId, userName: user.userName},
          tripRequest: requestBody
        };
        if (this.openTask == ADD_TASK) {
          const formData = new FormData();
          this.mediaFileList.forEach((file) => {
            formData.append('documents', file);
          });
          formData.append('TSMSRequest ', new Blob([JSON.stringify(request)], {
            type: 'application/json'
          }));
          this.organizerService.createOrganizedTrip(formData).subscribe({
            next: (res) => {
              if (res.status == SUCCESS_CODE) {
                this.toastService.successMessage(res.message);
                this.router.navigate(['/post-log/organize'])
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
        } else if (this.openTask == UPDATE_TASK) {
          request.tripRequest.id = this.organizedTripDataSet?.id!;
          request.tripRequest.tripOptionList = [];
          const newUpdateRequest = {
            userDto: {id: request.userDto.id},
            tripRequest: request.tripRequest
          }

          this.organizerService.updateOrganizedTrip(newUpdateRequest).subscribe({
            next: (res) => {
              if (res.status == SUCCESS_CODE) {
                this.toastService.successMessage(res.message);
                this.router.navigate(['/post-log/organize'])
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
      } else {
        this.storageService.clearSessionStorage();
        this.router.navigate(['/'])
      }
    }
  }

  private toDateGreaterThanFromDateValidator(formGroup: FormGroup) {
    const fromDate = formGroup.get('fromDate')?.value;
    const toDate = formGroup.get('toDate')?.value;
    if (fromDate && toDate && toDate < fromDate) {
      return formGroup.get('toDate')?.setErrors({'toDateLessThanFromDate': true});
    } else if (formGroup.get('toDate')?.hasError('toDateLessThanFromDate')) {
      return formGroup.get('toDate')?.setErrors(null);
    }
  }

  get getFormId() {
    return this.createTripForm.get('id');
  }

  get getFormTripCategoryList() {
    return this.createTripForm.get('tripCategoryList');
  }

  get getFormTripName() {
    return this.createTripForm.get('tripName');
  }

  get getFormDescription() {
    return this.createTripForm.get('description');
  }

  get getFormFromDate() {
    return this.createTripForm.get('fromDate');
  }

  get getFormToDate() {
    return this.createTripForm.get('toDate');
  }

  get getForm() {
    return this.createTripForm.get('');
  }

  get getFormReservationCloseDate() {
    return this.createTripForm.get('reservationCloseDate');
  }

  get getFormFinalCancelDate() {
    return this.createTripForm.get('finalCancelDate');
  }

  get getFormMaxParticipantCount() {
    return this.createTripForm.get('maxParticipantCount');
  }

  get getFormAdvertise_tripName() {
    return this.createTripForm.get('advertise_tripName');
  }

  get getFormAdertise_tripDetails() {
    return this.createTripForm.get('adertise_tripDetails');
  }

  get getFormTripOptionList() {
    return this.createTripForm.get('tripOptionList');
  }

  get getFormDocuments() {
    return this.createTripForm.get('documents');
  }

  get getFormDocumentList() {
    return this.createTripForm.get('documentList');
  }

  get getFormStatus() {
    return this.createTripForm.get('status');
  }

  protected readonly VIEW_TASK = VIEW_TASK;
  protected readonly UPDATE_TASK = UPDATE_TASK;
  protected readonly ADD_TASK = ADD_TASK;
}
