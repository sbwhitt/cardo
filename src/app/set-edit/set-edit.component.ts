import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { ColorChoiceComponent } from '../menu/color-choice/color-choice.component';
import { SetsService } from '../services/sets.service';
import { Set } from '../models';

@Component({
  selector: 'app-set-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    ColorChoiceComponent
  ],
  templateUrl: './set-edit.component.html',
  styleUrl: './set-edit.component.scss'
})
export class SetEditComponent {
  confirmOpen = false;

  setForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    color: new FormControl<string | null>(null, Validators.required)
  });

  @Input() set!: Set | null;

  constructor(
    private setsService: SetsService
  ) {}

  ngOnInit() {
    this.setForm.patchValue({
      name: this.set?.name,
      color: this.set?.color
    });
  }

  getColorOptions(): string[] {
    return this.setsService.colorOptions;
  }

  update() {
    if (!this.set) { return; }
    const formValue = this.setForm.value;
    this.setsService.updateSet({
      ...this.set,
      name: formValue.name ? formValue.name : '',
      color: formValue.color ? formValue.color : 'lightgray'
    })
    .then(() => this.close());
  }

  delete() {
    if (!this.set) { return; }
    this.setsService.deleteSet(this.set.id)
    .then(() => this.close());
  }

  close() {
    this.set = null;
  }

}