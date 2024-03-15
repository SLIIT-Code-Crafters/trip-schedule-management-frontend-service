import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {TripCategory} from "../../../interfaces/trip-category/TripCategory";
import {AppToastService} from "../../../services/toastr/toast.service";
import {DeleteModalComponent} from "../shared/delete-modal/delete-modal.component";
import {ModalCrudComponent} from "../shared/modal-crud/modal-crud.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {HeaderComponent} from "../shared/header/header.component";
import {DatatableComponent} from "@swimlane/ngx-datatable/lib/components/datatable.component";

@Component({
  selector: 'app-sys-admin-trip-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    HeaderComponent,
  ],
  templateUrl: './sys-admin-trip-category.component.html',
  styleUrls: ['./sys-admin-trip-category.component.scss']
})
export class SysAdminTripCategoryComponent implements OnInit, OnDestroy {

  @ViewChild('catTable', {static: true}) catTable:DatatableComponent|undefined;
  @ViewChild('actionOne', {static: true}) actionOne: TemplateRef<any> | undefined;

  private modalRef: NgbModalRef|undefined;
  private readonly ADD_TASK: string = 'ADD';
  private readonly UPDATE_TASK: string = 'UPDATE';
  private readonly VIEW_TASK: string = 'VIEW';

  protected columnsWithFeatures: any;
  private dataWithFeatures: TripCategory[] = [];
  protected viewDataWithFeatures: TripCategory[] = [];

  searchText: any;

  constructor(
      private modalService: NgbModal,
      private toastService: AppToastService,
  ) {
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.dataWithFeatures = [];
    this.viewDataWithFeatures = [];
    this._setTableFeatures();
    this.getPageLoadData();
  }


  private _setTableFeatures() {
    this.columnsWithFeatures = [
      {prop: 'id', name: "ID", width: 20, sortable: true},
      {name: "CODE", width: 40, sortable: true},
      {name: 'NAME', width: 120, sortable: true},
      {name: 'DESCRIPTION', sortable: false},
      {name: 'ADDED DATE', width: 100, sortable: true},
      {
        prop: 'action',
        name: 'Action',
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
        id: "10",
        code: "1",
        name: "Brendan",
        description: "1-724-406-2487",
        addedDate: "2022/01/03",
      },
      {
        id: "2",
        code: "2",
        name: "Warren",
        description: "1-412-485-9725",
        addedDate: "2022/01/04",
      },
      {
        id: "3",
        code: "oi",
        name: "qwBrendan",
        description: "1-724-406-2487",
        addedDate: "2022/01/09",
      },
      {
        id: "4",
        code: "4ac",
        name: "rarren",
        description: "1-412-485-9725",
        addedDate: "2022/02/04",
      },
      {
        id: "5",
        code: "ad5",
        name: "dssendan",
        description: "1-724-406-2487",
        addedDate: "2023/05/11",
      },
      {
        id: "6",
        code: "6ad",
        name: "Warren",
        description: "1-412-485-9725",
        addedDate: "2024/03/04",
      },
      {
        id: "7",
        code: "7ass",
        name: "Brendan",
        description: "1-724-406-2487",
        addedDate: "2023/10/14",
      },
    ];
    this.searchItems();
  }

  addCategory() {
    this._openModel(this.ADD_TASK, null);
  }

  viewCategory(rowData: TripCategory) {
    this._openModel(this.VIEW_TASK, rowData);
  }

  updateCategory(rowData: TripCategory) {
    this._openModel(this.UPDATE_TASK, rowData);
  }


  removeCategory(rowData: TripCategory) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(DeleteModalComponent, {centered: true, backdrop: false});
    this.modalRef.result.then(result => {
      if (result == 'remove-it') {
        const index = this.dataWithFeatures.findIndex(item => item.code === rowData.code);
        if (index !== -1) {
          this.dataWithFeatures = [...this.dataWithFeatures];
          this._updateLocalStorage();
          this.toastService.successMessage('Category was deleted successfully')
        }
      }
    }).catch(err => {
    });
  }


  private _openModel(task: string, data: TripCategory|null) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(ModalCrudComponent, {centered: true, backdrop: false});
    this.modalRef.componentInstance.openedTask = task;
    this.modalRef.componentInstance.data = data;
    if (task == this.ADD_TASK || this.UPDATE_TASK) {
      this.modalRef.componentInstance.passEntry.subscribe((trip: TripCategory | null) => {
        if (task == this.ADD_TASK) {
          if (trip) {
            this.dataWithFeatures.push(trip);
            this.modalRef?.close();
            this._updateLocalStorage();
            this.toastService.successMessage('Category was added successfully')
          }
        } else if (task == this.UPDATE_TASK) {
          this.dataWithFeatures = this._updateDataList(this.dataWithFeatures, trip!)
          this.modalRef?.close();
          this._updateLocalStorage();
          this.toastService.successMessage('Category was updated successfully')
        }
      });
    }
  }

  private _updateDataList(dataSet: TripCategory[], fieldsToUpdate: Partial<TripCategory>) {
    return dataSet.map(obj => obj.id === fieldsToUpdate.id ? {...obj, ...fieldsToUpdate} : obj);
  }

  private _updateLocalStorage() {
    this.searchItems();
  }

  searchItems() {
    if (this.searchText) {
      const filteredItems = this.dataWithFeatures.filter(item => item.code.includes(this.searchText.trim()));
      this.viewDataWithFeatures = [...filteredItems]
    } else {
      this.viewDataWithFeatures = [...this.dataWithFeatures];
    }
    this._sortingItems();
    this.catTable?.recalculate();
  }

  private _sortingItems(){
    this.viewDataWithFeatures = this.viewDataWithFeatures.sort((a, b) => {
      if (a.addedDate === b.addedDate) {
        return a.name.localeCompare(b.name);
      }
      return a.addedDate.localeCompare(b.addedDate);
    });
  }

}
