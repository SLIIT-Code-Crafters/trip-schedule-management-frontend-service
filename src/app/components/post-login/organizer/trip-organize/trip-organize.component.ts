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
import {SUCCESS_CODE} from "../../../../utility/common/response-code";
import {OrganizedTrip} from "../../../../interfaces/create-trip/OrganizedTrip";
import {OrganizerService} from "../../../../services/organizer/organizer.service";
import {Router} from "@angular/router";
import {
  TripDeleteModalComponentComponent
} from "../shared/trip-delete-modal-component/trip-delete-modal-component.component";

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

  private modalRef: NgbModalRef | undefined;

  protected columnsWithFeatures: any;
  protected viewDataWithFeatures: OrganizedTrip[] = [];

  protected searchText: string = '';
  protected searchStatus: string = STATUS_ACTIVE;
  protected tableRowCount: number = DEFAULT_PAGE_SIZE;

  private searchTextParams: string = '';
  private searchStatusParams: string = STATUS_ACTIVE;

  protected paginationData: PaginatorData = {
    limit: DEFAULT_PAGE_SIZE,
    pageSize: DEFAULT_PAGE_SIZE,
    offset: 0,
    count: 0
  };

  constructor(
    private modalService: NgbModal,
    private toastService: AppToastService,
    private organizerService: OrganizerService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.viewDataWithFeatures = [];
    this._setTableFeatures();
    this.getPageLoadData(this.setDataTableParam({
      limit: DEFAULT_PAGE_SIZE,
      pageSize: DEFAULT_PAGE_SIZE,
      offset: 1,
      count: 0
    }));
  }


  private _setTableFeatures() {
    this.columnsWithFeatures = [
      {prop: 'id', name: "ID", width: 20, sortable: true},
      {name: "CODE", width: 70, sortable: true},
      {name: 'NAME',prop:'tripName', width: 140, sortable: true},
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
    this.viewDataWithFeatures = [];
    this.paginationData.count = 3;
    this.paginationData.offset = pageInfo?.offset || 0;
    this.viewDataWithFeatures = [
      {
      id: "1",
      code: "TRP001",
      tripCategory: "Adventure",
      tripName: "Hiking Expedition",
      description: "Experience the thrill of hiking through breathtaking landscapes.",
      fromDate: "2024-06-15",
      toDate: "2024-06-20",
      closingDate: "2024-05-15",
      finalCancelDate: "2024-06-01",
      maxParticipationCount: "20",
      advertisementName: "Explore the Wild",
      advertisementDescription: "Join us on this adventurous journey into the wilderness.",
      tipOptionList: [
        { id: "1", displayName: "Standard Package", optionsSet: [] },
        { id: "2", displayName: "Premium Package",  optionsSet: []}
      ],
      mediaList: [
        { id: "1", displayName: "image", media: "https://example.com/hiking1.jpg" },
        { id: "2", displayName: "image", media: "https://example.com/hiking2.jpg" }
      ],
      status: "active",
      createdBy: "Organizer123",
      createdDate: "2024-04-10"
    },{
      id: "2",
      code: "TRP002",
      tripCategory: "Cultural",
      tripName: "Historical Tour",
      description: "Explore ancient ruins and learn about the rich history of the region.",
      fromDate: "2024-07-10",
      toDate: "2024-07-15",
      closingDate: "2024-06-30",
      finalCancelDate: "2024-07-05",
      maxParticipationCount: "15",
      advertisementName: "Journey Through Time",
      advertisementDescription: "Embark on a historical voyage filled with fascinating stories.",
      tipOptionList: [
        { id: "1", displayName: "Basic Package",  optionsSet: []},
        { id: "2", displayName: "Deluxe Package",  optionsSet: []}
      ],
      mediaList: [
        { id: "1", displayName: "image", media: "https://example.com/history1.jpg" },
        { id: "2", displayName: "image", media: "https://example.com/history2.jpg" }
      ],
      status: "active",
      createdBy: "HistoryBuff99",
      createdDate: "2024-05-20"
    },{
      id: "3",
      code: "TRP003",
      tripCategory: "Relaxation",
      tripName: "Beach Retreat",
      description: "Unwind and enjoy the sun, sand, and sea at our luxurious beach resort.",
      fromDate: "2024-08-20",
      toDate: "2024-08-25",
      closingDate: "2024-07-31",
      finalCancelDate: "2024-08-10",
      maxParticipationCount: "25",
      advertisementName: "Sunset Paradise",
      advertisementDescription: "Escape to paradise and experience ultimate relaxation.",
      tipOptionList: [
        { id: "1", displayName: "Standard Package",  optionsSet: []},
        { id: "2", displayName: "VIP Package",  optionsSet: []}],
      mediaList: [
        { id: "1", displayName: "image", media: "https://example.com/beach1.jpg" },
        { id: "2", displayName: "image", media: "https://example.com/beach2.jpg" }
      ],
      status: "active",
      createdBy: "BeachLover123",
      createdDate: "2024-06-15"
    }];
    
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
       
      }
    }).catch(err => {
    });
  }


  private _openModel(task: string, data: OrganizedTrip | null) {
    this.router.navigate(['/post-log/organize/create-trip']);
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
