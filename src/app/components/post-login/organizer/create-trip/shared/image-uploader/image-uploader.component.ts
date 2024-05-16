import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {VIEW_TASK} from "../../../../../../utility/common/common-constant";

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent {

  @Input() openedTask:string = '';

  @Input() previewImage: unknown = '';

  protected fileChangeFileEvent(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToBase64(file).then(value => {
        console.log(value)
        if(value){
          this.previewImage = value;
        }
      }).catch(reason => {
        console.log(reason)
      });
    }
  }

  fileToBase64(file: File) {
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

  protected readonly VIEW_TASK = VIEW_TASK;
}
