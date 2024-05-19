import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageUploaderComponent} from "../image-uploader/image-uploader.component";
import {CommonModule} from "@angular/common";
import {TripMedia} from "../../../../../../interfaces/create-trip/create-trip-option/TripMedia";
import {ADD_TASK, UPDATE_TASK, VIEW_TASK} from "../../../../../../utility/common/common-constant";
import {SUCCESS_CODE} from "../../../../../../utility/common/response-code";
import {OrganizerService} from "../../../../../../services/organizer/organizer.service";
import {User} from "../../../../../../model/User";
import {TripCreateRequest} from "../../../../../../interfaces/request/TripCreateRequest";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../../../../services/storage/local-storage.service";
import {AppToastService} from "../../../../../../services/toastr/toast.service";

@Component({
  selector: 'app-media-modal',
  standalone: true,
  imports: [
    CommonModule,
    ImageUploaderComponent
  ],
  templateUrl: './media-modal.component.html',
  styleUrls: ['./media-modal.component.scss']
})
export class MediaModalComponent implements OnInit {

  tripId:string = ''

  openTask: string = '';
  mediaList: TripMedia[] = [];

  mediaFileList: File[] = [];

  constructor(
    protected activeModal: NgbActiveModal,
    private organizerService:OrganizerService,
    private router:Router,
    private storageService:LocalStorageService,
    private toastService:AppToastService
  ) {
  }

  ngOnInit(): void {
    if (this.mediaList && this.mediaList.length > 0) {
      // this.mediaFileList = this.mediaList.map(value => {
      //   return new File([value.uniqueName],value.originalName);
      // })
      this.mediaList.forEach(value => {
        this.callGetImage(value);
      })
    }
  }

  private callGetImage(mediaDetails:TripMedia){
    this.organizerService.getMedia(mediaDetails).subscribe({
      next: (res) => {
        this.mediaFileList .push(new File([res], mediaDetails.originalName));
      },
      error: (err) => {
      }
    })
  }

  removeImage(id: number) {
if(this.openTask == ADD_TASK){
  this.mediaFileList.splice(id, 1)!;
}else if(this.openTask == UPDATE_TASK) {
  const user: User | null = this.storageService.getUserSession();
  const optionRequest = {
    userDto: {id: user?.userId},
    tripId: this.tripId,
    docId:this.mediaList[id].id
  }

  this.organizerService.removeMedia(optionRequest).subscribe({
    next: (res) => {
      if (res.status == SUCCESS_CODE) {
        this.toastService.successMessage(res.message);
        this.mediaFileList.splice(id, 1)!;
        this.mediaList.splice(id, 1)!;
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
  }

  protected setMediaFileList(file: File) {
    if (file) {
      if(this.openTask == ADD_TASK){
        this.mediaFileList.push(file);
      }else if(this.openTask == UPDATE_TASK) {
        const user: User | null = this.storageService.getUserSession();
        if (user) {
          const request = {
            userDto: {id: user?.userId, userName: user.userName},
            tripRequest: {
              id:this.tripId
            }
          };
          const formData = new FormData();
          formData.append('documents', file);
          formData.append('TSMSRequest ', new Blob([JSON.stringify(request)], {
            type: 'application/json'
          }));
          this.organizerService.addMedia(formData).subscribe({
            next: (res) => {
              if (res.status == SUCCESS_CODE) {
                this.toastService.successMessage(res.message);
                this.mediaFileList.push(file);
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
      }else{
        this.storageService.clearSessionStorage();
        this.router.navigate(['/'])
      }
    }
  }


  saveMedia() {
    this.activeModal.close({status: 'save-media', data: this.mediaFileList},);
  }

  protected readonly ADD_TASK = ADD_TASK;
  protected readonly UPDATE_TASK = UPDATE_TASK;
  protected readonly VIEW_TASK = VIEW_TASK;
}
