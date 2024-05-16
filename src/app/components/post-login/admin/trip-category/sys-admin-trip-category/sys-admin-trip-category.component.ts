import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DeleteModalComponent} from "../shared/delete-modal/delete-modal.component";
import {ModalCrudComponent} from "../shared/modal-crud/modal-crud.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {DatatableComponent} from "@swimlane/ngx-datatable/lib/components/datatable.component";
import {TripCategory} from "../../../../../interfaces/trip-category/TripCategory";
import {
  ADD_TASK,
  DEFAULT_PAGE_SIZE,
  STATUS_ACTIVE,
  STATUS_DELETED,
  STATUS_INACTIVE,
  UPDATE_TASK,
  VIEW_TASK
} from "../../../../../utility/common/common-constant";
import {PaginatorData} from "../../../../../interfaces/PaginatorData";
import {AppToastService} from "../../../../../services/toastr/toast.service";
import {AdminService} from "../../../../../services/admin/admin.service";
import {SUCCESS_CODE} from "../../../../../utility/common/response-code";
import {LocalStorageService} from "../../../../../services/storage/local-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sys-admin-trip-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
  ],
  templateUrl: './sys-admin-trip-category.component.html',
  styleUrls: ['./sys-admin-trip-category.component.scss']
})
export class SysAdminTripCategoryComponent implements OnInit, OnDestroy {

  @ViewChild('catTable', {static: true}) catTable: DatatableComponent | undefined;
  @ViewChild('actionOne', {static: true}) actionOne: TemplateRef<any> | undefined;

  private modalRef: NgbModalRef | undefined;

  protected columnsWithFeatures: any;
  protected viewDataWithFeatures: TripCategory[] = [];

  protected searchText: string = '';
  protected searchStatus: string = STATUS_ACTIVE;
  protected tableRowCount: number = DEFAULT_PAGE_SIZE;

  private searchTextParams: string = '';
  private searchStatusParams: string = STATUS_ACTIVE;

  private logUserEmail:string = '';

  protected paginationData: PaginatorData = {
    limit: DEFAULT_PAGE_SIZE,
    pageSize: DEFAULT_PAGE_SIZE,
    offset: 0,
    count: 0
  };

  constructor(
    private modalService: NgbModal,
    private toastService: AppToastService,
    private adminService: AdminService,
    private storageService:LocalStorageService,
    private router:Router
  ) {
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.viewDataWithFeatures = [];
    if(this.storageService.getUserSession() && this.storageService.getUserSession()?.email){
      this.logUserEmail = this.storageService.getUserSession()?.email!;
      this._setTableFeatures();
      this.getPageLoadData(this.setDataTableParam({
        limit: DEFAULT_PAGE_SIZE,
        pageSize: DEFAULT_PAGE_SIZE,
        offset: 1,
        count: 0
      }));
    }else{
      this.storageService.clearSessionStorage();
      this.router.navigate(['/']);
    }
  }


  private _setTableFeatures() {
    this.columnsWithFeatures = [
      {prop: 'id', name: "ID", width: 20, sortable: true},
      {name: "CODE", width: 70, sortable: true},
      {name: 'NAME', width: 140, sortable: true},
      {name: 'DESCRIPTION', width: 170, sortable: false},
      {name: 'CREATED DATE', width: 100, sortable: true},
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

  setDataTableParam(pgInfo: PaginatorData): Map<string, string> {
    let searchMap = new Map<string, string>();
    searchMap.set('pageNo', pgInfo.offset.toString());
    searchMap.set('pageSize', pgInfo.pageSize.toString());
    if (this.searchTextParams) {
      searchMap.set('searchWord', this.searchTextParams);
    }
    if (this.searchStatusParams) {
      searchMap.set('status', this.searchStatusParams);
    }
    return searchMap;
  }

  pageCallbackAllList(pageInfo: PaginatorData) {
    this.getPageLoadData(this.setDataTableParam({
      limit: this.paginationData.limit,
      pageSize: this.paginationData.pageSize,
      offset: pageInfo.offset + 1,
      count: pageInfo.count
    }), pageInfo);
  }

  private getPageLoadData(paramMap: Map<string, string>, pageInfo?: PaginatorData) {
    this.adminService.getAllTripCategory(paramMap).subscribe({
      next: (res) => {
        if (res.status == SUCCESS_CODE) {
          this.viewDataWithFeatures = res.data.tripCategoryDtos;
          this.paginationData.count = res.data.count;
          this.paginationData.offset = pageInfo?.offset || 0;
        } else {
          this.viewDataWithFeatures = [];
          this.paginationData.count = 0;
          this.paginationData.offset = pageInfo?.offset || 0;
          this.toastService.warningMessage(res.message);
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.viewDataWithFeatures = [];
          this.paginationData.count = 0;
          this.paginationData.offset = pageInfo?.offset || 0;
          this.toastService.errorMessage(err.error.message);
        }
      }
    })
  }

  addCategory() {
    this._openModel(ADD_TASK, null);
  }

  viewCategory(rowData: TripCategory) {
    this._openModel(VIEW_TASK, rowData);
  }

  updateCategory(rowData: TripCategory) {
    this._openModel(UPDATE_TASK, rowData);
  }

  removeCategory(rowData: TripCategory) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(DeleteModalComponent, {centered: true, backdrop: false});
    this.modalRef.result.then(result => {
      if (result == 'remove-it') {
        this.adminService.removeTripCategory(rowData.id, this.logUserEmail).subscribe({
          next: (res) => {
            if (res.status == SUCCESS_CODE) {
              this.searchItems();
              this.toastService.successMessage(res.message);
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
    }).catch(err => {
    });
  }


  private _openModel(task: string, data: TripCategory | null) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(ModalCrudComponent, {centered: true, backdrop: false});
    this.modalRef.componentInstance.openedTask = task;
    this.modalRef.componentInstance.data = data;
    if (task == ADD_TASK || UPDATE_TASK) {
      this.modalRef.componentInstance.passEntry.subscribe((status: boolean) => {
        if (status) {
          this.modalRef?.close();
          this.searchItems();
        }
      });
    }
  }

  protected resetSearch() {
    this.searchText = '';
    this.searchStatus = STATUS_ACTIVE;
    this.searchItems();
  }

  protected searchItems() {
    this.searchTextParams = this.searchText;
    this.searchStatusParams = this.searchStatus;
    this.paginationData = {
      limit: this.tableRowCount,
      pageSize: this.tableRowCount,
      offset: 0,
      count: 0
    };
    this.callGetPageLoadData();
  }

  protected pageCountChanged() {
    this.paginationData = {
      limit: this.tableRowCount,
      pageSize: this.tableRowCount,
      offset: 0,
      count: 0
    };
    this.callGetPageLoadData();
  }

  private callGetPageLoadData() {
    let pData: PaginatorData = JSON.parse(JSON.stringify(this.paginationData));
    pData.offset = pData.offset + 1;
    this.getPageLoadData(this.setDataTableParam(pData));
  }

  protected readonly STATUS_DELETED = STATUS_DELETED;
  protected readonly STATUS_INACTIVE = STATUS_INACTIVE;
  protected readonly STATUS_ACTIVE = STATUS_ACTIVE;
}
