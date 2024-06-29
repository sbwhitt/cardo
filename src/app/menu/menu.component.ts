import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { drop } from './menu.animations';
import { SettingsService } from '../services/settings.service';
import { ActionSliderComponent } from './action-slider/action-slider.component';
import { CardsService } from '../services/cards.service';
import { NotificationsService } from '../services/notifications.service';
import { TypeColorPipe } from '../pipes/type-color.pipe';
import { CardType } from '../models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ActionSliderComponent, TypeColorPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [drop]
})
export class MenuComponent {
  dropState = 'inactive';

  typeOptions!: string[];

  @Input() settingsOpen = false;
  @Input() addCardOpen = false;

  @Output() closePressed = new EventEmitter<void>();

  settingsForm = new FormGroup({
    deckSize: new FormControl(this.settingsService.getDeckSize(), [Validators.min(1), Validators.required])
  });

  addCardForm = new FormGroup({
    base: new FormControl(null, [Validators.required, Validators.minLength(1)]),
    goal: new FormControl(null, Validators.required),
    type: new FormControl("masculine", Validators.required),
    goal_sent_1: new FormControl(""),
    base_sent_1: new FormControl(""),
    goal_sent_2: new FormControl(""),
    base_sent_2: new FormControl("")
  });

  constructor(
    private cardsService: CardsService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.typeOptions = this.cardsService.typeOptions;
  }

  resetAddForm() {
    this.addCardForm.reset();
    this.addCardForm.patchValue({ type: "masculine" });
  }

  close() {
    if (this.addCardOpen) {
      this.resetAddForm();
    }
    this.settingsOpen = false;
    this.addCardOpen = false;
    this.closePressed.emit()
  }

  addCard() {
    const card = {
      id: -1,
      base: this.addCardForm.controls.base.value ?
        this.addCardForm.controls.base.value : "",
      goal: this.addCardForm.controls.goal.value ?
        this.addCardForm.controls.goal.value : "",
      type: this.addCardForm.controls.type.value ?
        this.addCardForm.controls.type.value : "other",
      goal_sent_1: this.addCardForm.controls.goal_sent_1.value ?
        this.addCardForm.controls.goal_sent_1.value : "",
      base_sent_1: this.addCardForm.controls.base_sent_1.value ?
        this.addCardForm.controls.base_sent_1.value : "",
      goal_sent_2: this.addCardForm.controls.goal_sent_2.value ?
        this.addCardForm.controls.goal_sent_2.value : "",
      base_sent_2: this.addCardForm.controls.base_sent_2.value ?
        this.addCardForm.controls.base_sent_2.value : "",
      starred: false,
    };
    // @ts-ignore
    this.cardsService.add(card).then(() => {
      this.close();
      this.notificationsService.push({ message: 'Card added!', success: true });
    })
    .catch((err) => {
      this.notificationsService.push({
        message: 'Error adding card to db! ' + err, success: false
      });
      alert('Error adding card to db! ' + err);
    });
  }

  getDropState() {
    return (this.settingsOpen || this.addCardOpen) ? 'active' : 'inactive';
  }

  getDealFromStarred(): boolean {
    return this.settingsService.getDealStarred();
  }

  toggleDealFromStarred() {
    this.settingsService.setDealStarred(!this.settingsService.getDealStarred());
  }

  getBaseFront(): boolean {
    return this.settingsService.getBaseFront();
  }

  toggleBaseFront() {
    this.settingsService.setBaseFront(!this.settingsService.getBaseFront());
  }

  setDeckSize() {
    const deckSize = this.settingsForm.controls.deckSize.value;
    if (!deckSize) { return; }
    this.settingsService.setDeckSize(deckSize);
    this.notificationsService.push({ message: 'Deck size updated!', success: true });
  }
}
