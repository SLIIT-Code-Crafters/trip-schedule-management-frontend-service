import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SingleOptionComponent} from '../single-option/single-option.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AppToastService} from "../../../../../../services/toastr/toast.service";
import {TripOption} from "../../../../../../interfaces/create-trip/create-trip-option/TripOption";
import {UPDATE_TASK} from "../../../../../../utility/common/common-constant";

@Component({
  selector: 'app-main-option',
  standalone: true,
  imports: [
    CommonModule,
    SingleOptionComponent,
    ReactiveFormsModule
  ],
  templateUrl: './main-option.component.html',
  styleUrls: ['./main-option.component.scss']
})
export class MainOptionComponent implements OnInit {

  @Input() supOptionSet!: TripOption;
  @Output() removeOption: EventEmitter<string> = new EventEmitter();
  superFrom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: AppToastService,
  ) {
    this.superFrom = this.fb.group({
      id: [null],
      displayName: [null, [Validators.required]],
      optionsSet: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this._setForm();
  }

  private _setForm() {
    if (this.supOptionSet) {
      this.fromId?.setValue(this.supOptionSet.id);
      this.fromDisplayName?.setValue(this.supOptionSet.displayName);
      if (this.supOptionSet.optionsSet && this.supOptionSet.optionsSet.length > 0) {
        this.supOptionSet.optionsSet.forEach(op => {
          this.formOptionsArray.push(
            this.fb.group({
              id: [op.id, [Validators.required]],
              title: [op.title, [Validators.required]],
              description: [op.description],
              cost: [op.cost, [Validators.required]],
            })
          );
        });
      } else {
        this._addNewGroup();
      }
    } else {
      this._addNewGroup();
    }
  }

  removeSubOption(id: string) {
    if (id) {
      const index = this.formOptionsArrayGroup.findIndex(item => item.get('id')?.value === id);
      if (index !== -1) {
        this.removeOptions(index);
        this.toastService.successMessage('Option was removed successfully');
      }
    }
    if (this.formOptionsArray.length == 0) {
      this._addNewGroup();
    }
  }

  private _addNewGroup() {
    this.formOptionsArray.push(
      this.fb.group({
        id: Math.random().toString(36).slice(2, 8),
        title: ['', [Validators.required]],
        description: '',
        cost: ['', [Validators.required]]
      }));
  }

  addOption() {
    this._addNewGroup();
  }

  get fromId() {
    return this.superFrom.get('id');
  }

  get fromDisplayName() {
    return this.superFrom.get('displayName');
  }

  get formOptionsArray(): FormArray {
    return this.superFrom.get('optionsSet') as FormArray;
  }

  get formOptionsArrayGroup(): FormGroup[] {
    return this.formOptionsArray.controls as FormGroup[];
  }

  removeOptions(index: number): void {
    this.formOptionsArray.removeAt(index);
  }

  protected readonly UPDATE_TASK = UPDATE_TASK;

}
