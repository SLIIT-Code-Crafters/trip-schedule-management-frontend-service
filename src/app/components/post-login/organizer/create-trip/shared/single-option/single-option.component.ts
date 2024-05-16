import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ADD_TASK, UPDATE_TASK} from "../../../../../../utility/common/common-constant";

@Component({
  selector: 'app-single-option',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './single-option.component.html',
  styleUrls: ['./single-option.component.scss']
})
export class SingleOptionComponent implements OnChanges {

  @Input() subNumber: number = 0;
  @Input() arrayLength: number = 0;
  @Input() subForm!: FormGroup;
  @Input() openedTask: string = '';
  @Output() removeSubOption: EventEmitter<string> = new EventEmitter();

  protected cardNumber: string = '01';

  ngOnChanges(changes: SimpleChanges) {
    this._setInitialData();
  }

  private _setInitialData() {
    const viewNum: number = this.subNumber + 1;
    if (viewNum < 10) {
      this.cardNumber = '0' + viewNum;
    } else {
      this.cardNumber = viewNum.toString();
    }
  }

  protected removeOption() {
    this.removeSubOption.emit(this.formId?.value);
  }

  get formId() {
    return this.subForm.get('id');
  }

  get formName() {
    return this.subForm.get('name');
  }

  get formDescription() {
    return this.subForm.get('description');
  }

  get formCost() {
    return this.subForm.get('cost');
  }

  protected readonly ADD_TASK = ADD_TASK;
  protected readonly UPDATE_TASK = UPDATE_TASK;
}
