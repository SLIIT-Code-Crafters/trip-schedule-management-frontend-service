import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DeleteContentModalComponent} from "../shared/delete-modal/delete-content-modal.component";
import {ContentModalCrudComponent} from "../shared/content-modal-crud/content-modal-crud.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {DatatableComponent} from "@swimlane/ngx-datatable/lib/components/datatable.component";
import {SiteContent} from "../../../../../interfaces/site-content/SiteContent";
import {AppToastService} from "../../../../../services/toastr/toast.service";
import {
    ADD_TASK,
    STATUS_ACTIVE,
    STATUS_DELETED,
    UPDATE_TASK,
    VIEW_TASK
} from "../../../../../utility/common/common-constant";

@Component({
  selector: 'app-sys-admin-site-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './sys-admin-site-content.component.html',
  styleUrls: ['./sys-admin-site-content.component.scss']
})
export class SysAdminSiteContentComponent implements OnInit, OnDestroy {
  @ViewChild('catTable', {static: true}) catTable: DatatableComponent | undefined;
  @ViewChild('actionOne', {static: true}) actionOne: TemplateRef<any> | undefined;

  private modalRef: NgbModalRef | undefined;

  protected columnsWithFeatures: any;
  private dataWithFeatures: SiteContent[] = [];
  protected viewDataWithFeatures: SiteContent[] = [];

  searchText: string = '';
  searchStatus: string = '1';

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
      {prop: 'id', name: "ID", width: 70, sortable: true},
      {prop: 'title', name: "TITLE", width: 70, sortable: true},
      {prop: 'description', name: 'DESCRIPTION', sortable: false},
      {prop: 'searchText', name: 'SEARCH ENGINE TEXT', width: 160, sortable: true},
      {prop: 'fromDate', name: 'FROM DATE', width: 100, sortable: true},
      {prop: 'toDate', name: 'TO DATE', width: 100, sortable: true},
      {prop: 'noOfDay', name: 'DISPLAY PER DAY', width: 120, sortable: true},
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
  protected getPageLoadData() {
    this.dataWithFeatures = [
      {
        id: "11",
        title: "title 2",
        description: "2-724-406-2487 description",
        searchText: "mountain",
        fromDate: "2022/02/10",
        toDate: "2022/02/15",
        noOfDay: "6"
      },
      {
        id: "12",
        title: "title 3",
        description: "3-724-406-2487 description",
        searchText: "forest",
        fromDate: "2022/03/20",
        toDate: "2022/03/25",
        noOfDay: "6"
      },
      {
        id: "13",
        title: "title 4",
        description: "4-724-406-2487 description",
        searchText: "city",
        fromDate: "2022/04/05",
        toDate: "2022/04/08",
        noOfDay: "4"
      },
      {
        id: "14",
        title: "title 5",
        description: "5-724-406-2487 description",
        searchText: "lake",
        fromDate: "2022/05/12",
        toDate: "2022/05/17",
        noOfDay: "6"
      },
      {
        id: "15",
        title: "title 6",
        description: "6-724-406-2487 description",
        searchText: "river",
        fromDate: "2022/06/25",
        toDate: "2022/06/28",
        noOfDay: "4"
      },
      {
        id: "16",
        title: "title 7",
        description: "7-724-406-2487 description",
        searchText: "desert",
        fromDate: "2022/07/02",
        toDate: "2022/07/06",
        noOfDay: "5"
      },
      {
        id: "17",
        title: "title 8",
        description: "8-724-406-2487 description",
        searchText: "island",
        fromDate: "2022/08/15",
        toDate: "2022/08/20",
        noOfDay: "6"
      },
      {
        id: "18",
        title: "title 9",
        description: "9-724-406-2487 description",
        searchText: "cave",
        fromDate: "2022/09/28",
        toDate: "2022/10/02",
        noOfDay: "5"
      }
    ]
    this.searchItems();
  }

  addCategory() {
    this._openModel(ADD_TASK, null);
  }

  viewCategory(rowData: SiteContent) {
    this._openModel(VIEW_TASK, rowData);
  }

  updateCategory(rowData: SiteContent) {
    this._openModel(UPDATE_TASK, rowData);
  }


  removeCategory(rowData: SiteContent) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(DeleteContentModalComponent, {centered: true, backdrop: false});
    this.modalRef.result.then(result => {
      if (result == 'remove-it') {
        const index = this.dataWithFeatures.findIndex(item => item.id === rowData.id);
        if (index !== -1) {
          this.dataWithFeatures.splice(index, 1);
          this._updateLocalStorage();
          this.toastService.successMessage('Content was deleted successfully')
        }
      }
    }).catch(err => {
    });
  }


  private _openModel(task: string, data: SiteContent | null) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(ContentModalCrudComponent, {centered: true, backdrop: false});
    this.modalRef.componentInstance.openedTask = task;
    this.modalRef.componentInstance.data = data;
    if (task == ADD_TASK || UPDATE_TASK) {
      this.modalRef.componentInstance.passEntry.subscribe((content: SiteContent | null) => {
        if (task == ADD_TASK) {
          if (content) {
            this.dataWithFeatures.push(content);
            this.modalRef?.close();
            this._updateLocalStorage();
            this.toastService.successMessage('Content was added successfully')
          }
        } else if (task == UPDATE_TASK) {
          this.dataWithFeatures = this._updateDataList(this.dataWithFeatures, content!)
          this.modalRef?.close();
          this._updateLocalStorage();
          this.toastService.successMessage('Content was updated successfully')
        }
      });
    }
  }

  private _updateDataList(dataSet: SiteContent[], fieldsToUpdate: Partial<SiteContent>) {
    return dataSet.map(obj => obj.id === fieldsToUpdate.id ? {...obj, ...fieldsToUpdate} : obj);
  }

  private _updateLocalStorage() {
    this.searchItems();
  }

  protected searchItems() {
    if (this.searchText) {
      const filteredItems = this.dataWithFeatures.filter(item =>
        (item.searchText.toLowerCase().includes(this.searchText.toLowerCase().trim()) ||
          item.title.toLowerCase().includes(this.searchText.toLowerCase().trim()) || item.id.toLowerCase().includes(this.searchText.toLowerCase().trim())));
      this.viewDataWithFeatures = [...filteredItems];
    } else {
      this.viewDataWithFeatures = [...this.dataWithFeatures];
    }
    this._sortingItems();
    this.catTable?.recalculate();
  }

  protected resetSearch() {
    this.searchText = '';
    this.searchStatus = '1';
    this.searchItems();
  }

  private _sortingItems() {
    this.viewDataWithFeatures = this.viewDataWithFeatures.sort((a, b) => {
      if (a.fromDate === b.fromDate) {
        return a.title.localeCompare(b.title);
      }
      return a.fromDate.localeCompare(b.fromDate);
    });
  }

    protected readonly STATUS_ACTIVE = STATUS_ACTIVE;
    protected readonly STATUS_DELETED = STATUS_DELETED;
}
