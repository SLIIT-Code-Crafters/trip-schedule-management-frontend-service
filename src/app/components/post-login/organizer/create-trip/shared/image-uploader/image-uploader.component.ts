import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {VIEW_TASK} from "../../../../../../utility/common/common-constant";
import {SiteContent} from "../../../../../../interfaces/site-content/SiteContent";
import {CommonFunctionsService} from "../../../../../../services/common/common-functions.service";

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit{

  @ViewChild('fileInput') fileInputRef!: ElementRef;

  @Input() openedTask:string = '';
  @Input() previewImageFile: File|null = null;

  @Input() showOnly: boolean = false;

  @Output() passEntryImage: EventEmitter<any> = new EventEmitter();

  protected imge:string = '';

  constructor(
    private commonFunctionsService:CommonFunctionsService
  ) {
  }

  ngOnInit() {
    if(this.previewImageFile){
      this.fileToBase64(this.previewImageFile).then((value) => {
        if(value){
          this.imge = value.toString();
        }
      }).catch(reason => {
        console.log(reason)
      });
    }
  }

  protected fileChangeFileEvent(event: any): void {

    const file:File = event.target.files[0];
    // this.passEntryImage.emit(file);
    if (file) {
      this.fileToBase64(file).then((value) => {
        if(value){
          let val = value.toString().split(',')[1];
          const imageBlob = this.commonFunctionsService.dataURItoBlob(val);
          let imageFile: File = new File([imageBlob], file.name, {type: file.type});
          this.passEntryImage.emit(imageFile);
          this.removeFile();
        }
      }).catch(reason => {
        console.log(reason)
      });
    }
  }

 private fileToBase64(file: File) {
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


  removeFile(): void {
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  protected readonly VIEW_TASK = VIEW_TASK;
}
