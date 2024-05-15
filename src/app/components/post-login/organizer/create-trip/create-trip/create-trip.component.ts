import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OptionModalComponent} from '../shared/option-modal/option-modal.component';
import {DatatableComponent, NgxDatatableModule} from '@swimlane/ngx-datatable';
import {
  OptionRemoveModalDialogComponent
} from "../shared/option-remove-modal-dialog/option-remove-modal-dialog.component";
import {HeaderComponent} from "../../../../shared/header/header.component";
import {TripOption} from "../../../../../interfaces/create-trip/create-trip-option/TripOption";
import {AppToastService} from "../../../../../services/toastr/toast.service";
import {ADD_TASK, UPDATE_TASK, VIEW_TASK} from "../../../../../utility/common/common-constant";
import {CreateTripOption} from "../../../../../interfaces/create-trip/create-trip-option/CreateTripOption";
import { MediaModalComponent } from '../shared/media-modal/media-modal.component';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    HeaderComponent,
  ],
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss']
})
export class CreateTripComponent implements OnInit, OnDestroy {

  private modalRef: NgbModalRef | undefined;
  @ViewChild('catTable', {static: true}) catTable: DatatableComponent | undefined;
  @ViewChild('actionOne', {static: true}) actionOne: TemplateRef<any> | undefined;

  protected columnsWithFeatures: any;
  private dataWithFeatures: TripOption[] = [];
  protected viewDataWithFeatures: CreateTripOption[] = [];

  searchText: any;

  protected openTask:string = ADD_TASK;

  constructor(
    private modalService: NgbModal,
    private toastService: AppToastService,
  ) {
  }

  ngOnInit(): void {
    this.dataWithFeatures = [];
    this.viewDataWithFeatures = [];
    this._setTableFeatures();
    this.getPageLoadData();
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

  // get page initial loading data form API
  private getPageLoadData() {
    this.dataWithFeatures = [
      {
        id: '001',
        displayName: 'dis001',
        optionsSet: [
          {
            id: "1",
            title: "Product A",
            description: "High-quality product",
            cost: "$50.00"
          },
          {
            id: "2",
            title: "Product B",
            description: "Affordable option",
            cost: "$25.99"
          },
        ]
      },
      {
        id: '002',
        displayName: 'dis002',
        optionsSet: [
          {
            id: "2",
            title: "Product B",
            description: "Affordable option",
            cost: "$25.99"
          },
        ]
      },
      {
        id: '003',
        displayName: 'dis003',
        optionsSet: [
          {
            id: "1",
            title: "Product A",
            description: "High-quality product",
            cost: "$50.00"
          },
        ]
      },
      {
        id: '004',
        displayName: 'dis005',
        optionsSet: []
      },
      {
        id: '005',
        displayName: 'dis006',
        optionsSet: [
          {
            id: "1",
            title: "Product A",
            description: "High-quality product",
            cost: "$50.00"
          },
          {
            id: "2",
            title: "Product B",
            description: "Affordable option",
            cost: "$25.99"
          },
          {
            id: "3",
            title: "Product A",
            description: "High-quality product",
            cost: "$50.00"
          },
        ]
      },
      {
        id: '006',
        displayName: 'dis007',
        optionsSet: [
          {
            id: "2",
            title: "Product B",
            description: "Affordable option",
            cost: "$25.99"
          },
        ]
      },
      {
        id: '007',
        displayName: 'dis008',
        optionsSet: []
      },
      {
        id: '008',
        displayName: 'dis009',
        optionsSet: [
          {
            id: "2",
            title: "Product B",
            description: "Affordable option",
            cost: "$25.99"
          },
        ]
      }
    ];
    this.refreshDataSet();
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
        this.dataWithFeatures.push(option);
        option.id = Math.random().toString(36).substr(2, 8);
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
    this.viewDataWithFeatures = this.dataWithFeatures.map(val => {
      let tripOption: CreateTripOption = {
        id: val.id,
        displayName: val.displayName,
        optionCount: val.optionsSet.length.toString()
      }
      return tripOption;
    });
  }

}
