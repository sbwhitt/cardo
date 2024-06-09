import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { drop } from './menu.animations';
import { SettingsService } from '../services/settings.service';
import { ActionSliderComponent } from './action-slider/action-slider.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ReactiveFormsModule, ActionSliderComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [drop]
})
export class MenuComponent {
  dropState = 'inactive';

  menuForm = new FormGroup({
    deckSize: new FormControl(this.settingsService.getDeckSize(), [Validators.min(1), Validators.required])
  });

  @Input() open = false;

  @Output() closePressed = new EventEmitter<void>();

  constructor(
    private settingsService: SettingsService
  ) {}

  getDropState() {
    return this.open ? 'active' : 'inactive';
  }

  setDeckSize() {
    const deckSize = this.menuForm.controls.deckSize.value;
    if (!deckSize) { return; }
    this.settingsService.setDeckSize(deckSize);
  }

  getEnglishFront() {
    return this.settingsService.getEnglishFront();
  }

  toggleEnglishFront() {
    this.settingsService.setEnglishFront(!this.settingsService.getEnglishFront());
  }
}
