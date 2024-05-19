import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormsModule} from "@angular/forms";
import {DatatableComponent} from "@swimlane/ngx-datatable/lib/components/datatable.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {
  ADD_TASK,
  DEFAULT_PAGE_SIZE,
  STATUS_ACTIVE,
  STATUS_DELETED,
  STATUS_INACTIVE,
  UPDATE_TASK,
  VIEW_TASK
} from "../../../../utility/common/common-constant";
import {PaginatorData} from "../../../../interfaces/PaginatorData";
import {AppToastService} from "../../../../services/toastr/toast.service";
import {OrganizedTrip} from "../../../../interfaces/create-trip/OrganizedTrip";
import {OrganizerService} from "../../../../services/organizer/organizer.service";
import {NavigationExtras, Router} from "@angular/router";
import {
  TripDeleteModalComponentComponent
} from "../shared/trip-delete-modal-component/trip-delete-modal-component.component";
import {SUCCESS_CODE} from "../../../../utility/common/response-code";
import {LocalStorageService} from "../../../../services/storage/local-storage.service";
import {User} from "../../../../model/User";
import {TripCreateRequest} from "../../../../interfaces/request/TripCreateRequest";

@Component({
  selector: 'app-trip-organize',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, FormsModule],
  templateUrl: './trip-organize.component.html',
  styleUrls: ['./trip-organize.component.scss']
})
export class TripOrganizeComponent implements OnInit, OnDestroy {

  @ViewChild('catTable', {static: true}) catTable: DatatableComponent | undefined;
  @ViewChild('actionOne', {static: true}) actionOne: TemplateRef<any> | undefined;
  protected columnsWithFeatures: any;
  protected viewDataWithFeatures: OrganizedTrip[] = [];
  protected searchText: string = '';
  protected searchStatus: string = STATUS_ACTIVE;
  protected tableRowCount: number = DEFAULT_PAGE_SIZE;
  protected paginationData: PaginatorData = {
    limit: DEFAULT_PAGE_SIZE,
    pageSize: DEFAULT_PAGE_SIZE,
    offset: 0,
    count: 0
  };
  protected readonly STATUS_DELETED = STATUS_DELETED;
  protected readonly STATUS_INACTIVE = STATUS_INACTIVE;
  protected readonly STATUS_ACTIVE = STATUS_ACTIVE;
  private modalRef: NgbModalRef | undefined;
  private searchTextParams: string = '';
  private searchStatusParams: string = STATUS_ACTIVE;
  private logUserEmail: string = '';
  private logUserId: string = '';

  constructor(
    private modalService: NgbModal,
    private toastService: AppToastService,
    private organizerService: OrganizerService,
    private router: Router,
    private storageService: LocalStorageService,
  ) {
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.viewDataWithFeatures = [];
    if (this.storageService.getUserSession() && this.storageService.getUserSession()?.email && this.storageService.getUserSession()?.userId) {
      this.logUserId = this.storageService.getUserSession()?.userId!;
      this.logUserEmail = this.storageService.getUserSession()?.email!;

      this._setTableFeatures();
      this.getPageLoadData(this.setDataTableParam({
        limit: DEFAULT_PAGE_SIZE,
        pageSize: DEFAULT_PAGE_SIZE,
        offset: 1,
        count: 0
      }));
    } else {
      this.storageService.clearSessionStorage();
      this.router.navigate(['/']);
    }
  }

  setDataTableParam(pgInfo: PaginatorData): Map<string, string> {
    let searchMap = new Map<string, string>();
    searchMap.set('userId', this.logUserId);
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

  addNewTrip() {
    this._openModel(ADD_TASK, null);
  }

  viewTrip(rowData: OrganizedTrip) {
    this._openModel(VIEW_TASK, rowData);
  }

  updateTrip(rowData: OrganizedTrip) {
    this._openModel(UPDATE_TASK, rowData);
  }

  removeTrip(rowData: OrganizedTrip) {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
    this.modalRef = this.modalService.open(TripDeleteModalComponentComponent, {centered: true, backdrop: false});
    this.modalRef.result.then(result => {
      if (result == 'remove-it') {
        const user: User | null = this.storageService.getUserSession();
        if (user) {
          const request = {
            userDto: {id: user?.userId},
            tripId : rowData.id
          };
        this.organizerService.removeOrganizedTrip(request).subscribe({
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
        } else {
          this.storageService.clearSessionStorage();
          this.router.navigate(['/'])
        }
      }
    }).catch(err => {
    });
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

  private _setTableFeatures() {
    this.columnsWithFeatures = [
      {name: "ID", prop: 'id', width: 70, sortable: true},
      {name: 'NAME', prop: 'tripName', width: 140, sortable: true},
      {name: 'DESCRIPTION', prop: 'description', width: 170, sortable: false},
      {name: 'FROM DATE', prop: 'fromDate', width: 100, sortable: true},
      {name: 'TO DATE', prop: 'toDate', width: 100, sortable: true},
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

  private getPageLoadData(paramMap: Map<string, string>, pageInfo?: PaginatorData) {
    this.organizerService.getAllOrganizedTrip(paramMap).subscribe({
      next: (res) => {
        this.viewDataWithFeatures = [];
        if (res.status == SUCCESS_CODE) {
          this.viewDataWithFeatures = res.data.tripDto;
          this.paginationData.count = res.data.tripDto.length;
          this.paginationData.offset = pageInfo?.offset || 0;

          this.paginationData.pageSize = res.data.tripDto.length; //todo remove it
        } else {
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

  private _openModel(task: string, data: OrganizedTrip | null) {
    const navigationExtras: NavigationExtras = {
      state: {
        task: task,
        data: data
      }
    }
    this.router.navigate(['/post-log/organize/create-trip'], navigationExtras);
  }

  private callGetPageLoadData() {
    let pData: PaginatorData = JSON.parse(JSON.stringify(this.paginationData));
    pData.offset = pData.offset + 1;
    this.getPageLoadData(this.setDataTableParam(pData));
  }
}
