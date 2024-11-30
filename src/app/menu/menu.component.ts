import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { drop } from './menu.animations';
import { ActionSliderComponent } from './action-slider/action-slider.component';
import { ColorChoiceComponent } from './color-choice/color-choice.component';
import { TypeColorPipe } from '../pipes/type-color.pipe';
import { LanguagePipe } from '../pipes/language.pipe';
import { CardsService } from '../services/cards.service';
import { LingueeniService } from '../services/lingueeni.service';
import { MenuService } from '../services/menu.service';
import { NotificationsService } from '../services/notifications.service';
import { SetsService } from '../services/sets.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionSliderComponent,
    ColorChoiceComponent,
    TypeColorPipe,
    LanguagePipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [drop]
})
export class MenuComponent {
  subs: Subscription[] = [];

  dropState = 'inactive';

  typeOptions!: string[];

  settingsOpen = false;
  addCardOpen = false;
  addSetOpen = false;
  lingueeniLoaded = false;

  settingsForm = new FormGroup({
    deckSize: new FormControl(this.settingsService.getDeckSize(), [Validators.min(1), Validators.required])
  });

  addCardForm = new FormGroup({
    base: new FormControl<string>('', [Validators.required, Validators.minLength(1)]),
    goal: new FormControl<string>('', Validators.required),
    type: new FormControl<string>('masculine', Validators.required),
    goal_sent_1: new FormControl<string>(''),
    base_sent_1: new FormControl<string>(''),
    goal_sent_2: new FormControl<string>(''),
    base_sent_2: new FormControl<string>('')
  });

  addSetForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    color: new FormControl<string | null>(null, Validators.required)
  });

  constructor(
    private cardsService: CardsService,
    private lingueeniService: LingueeniService,
    private menuService: MenuService,
    private notificationsService: NotificationsService,
    private setsService: SetsService,
    private settingsService: SettingsService
  ) {}

  async ngOnInit() {
    this.subs = [
      this.menuService.settingsOpen.subscribe((val) => this.settingsOpen = val),
      this.menuService.addCardOpen.subscribe((val) => this.addCardOpen = val),
      this.menuService.addSetOpen.subscribe((val) => this.addSetOpen = val),
      this.settingsService.loaded.subscribe(() => {
        this.settingsForm.patchValue({
          deckSize: this.settingsService.getDeckSize()
        });
      })
    ];
    this.typeOptions = this.cardsService.typeOptions;
    this.lingueeniLoaded = await this.lingueeniService.load();
  }

  resetAddForm() {
    this.addCardForm.reset();
    this.addCardForm.patchValue({ type: 'masculine' });
  }

  close() {
    if (this.addCardOpen) { this.resetAddForm(); }
    if (this.addSetOpen) { this.addSetForm.reset(); }
    this.menuService.closeSettings();
    this.menuService.closeAddCard();
    this.menuService.closeAddSet();
  }

  async searchBase(): Promise<void> {
    const base = this.addCardForm.get('base')?.value;
    if (!base) { return; }
    const translation = await this.lingueeniService.getTranslationFromBase(base);
    if (!translation) { return; }
    
    this.addCardForm.patchValue({
      goal: translation.text
    });

    const numExamples = translation.examples.length;
    this.addCardForm.patchValue({
      goal_sent_1: numExamples ? translation.examples[0].dst : '',
      base_sent_1: numExamples ? translation.examples[0].src : '',
      goal_sent_2: numExamples > 1 ? translation.examples[1].dst : '',
      base_sent_2: numExamples > 1 ? translation.examples[1].src : ''
    });
  }

  async searchGoal(): Promise<void> {
    const goal = this.addCardForm.get('goal')?.value;
    if (!goal) { return; }
    const translation = await this.lingueeniService.getTranslationFromGoal(goal);
    if (!translation) { return; }
    
    this.addCardForm.patchValue({
      base: translation.text
    });

    const numExamples = translation.examples.length;
    this.addCardForm.patchValue({
      goal_sent_1: numExamples ? translation.examples[0].src : '',
      base_sent_1: numExamples ? translation.examples[0].dst : '',
      goal_sent_2: numExamples > 1 ? translation.examples[1].src: '',
      base_sent_2: numExamples > 1 ? translation.examples[1].dst : ''
    });
  }

  save() {
    if (this.addCardOpen) {
      this.addCard();
    }
    else if (this.addSetOpen) {
      this.addSet();
    }
  }

  addCard() {
    const card = {
      id: -1,
      base: this.addCardForm.controls.base.value ?
        this.addCardForm.controls.base.value : '',
      goal: this.addCardForm.controls.goal.value ?
        this.addCardForm.controls.goal.value : '',
      type: this.addCardForm.controls.type.value ?
        this.addCardForm.controls.type.value : 'other',
      goal_sent_1: this.addCardForm.controls.goal_sent_1.value ?
        this.addCardForm.controls.goal_sent_1.value : '',
      base_sent_1: this.addCardForm.controls.base_sent_1.value ?
        this.addCardForm.controls.base_sent_1.value : '',
      goal_sent_2: this.addCardForm.controls.goal_sent_2.value ?
        this.addCardForm.controls.goal_sent_2.value : '',
      base_sent_2: this.addCardForm.controls.base_sent_2.value ?
        this.addCardForm.controls.base_sent_2.value : '',
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
    });
  }

  getColorOptions(): string[] {
    return this.setsService.colorOptions;
  }

  addSet() {
    const setInput = this.addSetForm.value;
    const set = {
      id: -1,
      name: setInput.name ? setInput.name : '',
      color: setInput.color ? setInput.color : 'lightgray',
      cards: []
    }
    this.setsService.add(set)
      .then(() => this.close());
  }

  getDropState() {
    return (this.settingsOpen || this.addCardOpen || this.addSetOpen) ?
      'active' : 'inactive';
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
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
