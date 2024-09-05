import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CardComponent } from '../card/card.component';
import { CardsService } from '../services/cards.service';
import { NotificationsService } from '../services/notifications.service';
import { SettingsService } from '../services/settings.service';
import { TypeColorPipe } from '../pipes/type-color.pipe';
import { SetsService } from '../services/sets.service';
import { SetSelectService } from '../services/set-select.service';
import { Card, Set } from '../models';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    NavbarComponent,
    CardComponent,
    TypeColorPipe
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  loading = false;
  subs: Subscription[] = [];

  maxCards = 100;
  set: Set | null = null;
  results: Card[] = [];
  expanded = false;
  expandedCard: Card | null = null;
  query = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private cardService: CardsService,
    private notificationService: NotificationsService,
    private router: Router,
    private setsService: SetsService,
    private settingsService: SettingsService,
    private setSelectService: SetSelectService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.settingsService.loading ?
      this.settingsService.loaded.subscribe(() => this.init()) :
      this.init();
  }

  init() {
    this.cardService.loadCards().then((res: Card[]) => {
      this.results = res;
      this.loading = false;
    })
    .catch((err) => alert('Failed to get cards from database! ' + err));

    this.subs = [
      this.route.paramMap.subscribe((map) => this.loadCards(map)),
      this.query.valueChanges.subscribe((query) => {
        this.set ?
          this.filterSet(query) :
          this.filterAll(query)
      })
    ];
  }

  async loadCards(paramMap: ParamMap): Promise<void> {
    this.set = await this.setsService.loadSetFromParams(paramMap);
    return this.cardService.loadCards().then(async (res: Card[]) => {
      this.results = this.set ? await this.setsService.getCards(this.set.id) : res;
      this.loading = false;
    })
    .catch((err) => alert('Failed to get cards from database! ' + err));
  }

  getBaseFront(): boolean {
    return this.settingsService.getBaseFront();
  }

  async filterSet(query: string | null) {
    if (this.set === null) { return; }
    if (!query) {
      this.results = await this.setsService.getCards(this.set.id);
      return;
    }
    const cards = await this.setsService.getCards(this.set.id);
    this.results = cards.filter((card) => {
      return card.base.toLowerCase().includes(query.toLowerCase()) ||
            card.goal.toLowerCase().includes(query.toLowerCase());
    });
  }

  filterAll(query: string | null) {
    if (!query) {
      this.results = this.cardService.getCards();
      return;
    }
    this.results = this.cardService.getCards().filter((card) => {
      return card.base.toLowerCase().includes(query.toLowerCase()) ||
            card.goal.toLowerCase().includes(query.toLowerCase());
    });
  }

  openSetSelect(event: Event, card: Card) {
    event.stopPropagation();
    this.setSelectService.open(card.id);
  }

  expandCard(card: Card) {
    this.expanded = true;
    this.expandedCard = card;
  }

  updateResults(card: Card) {
    this.results.forEach((c, i) => {
      if (c.id === card.id) {
        this.results[i] = card;
        return;
      }
    })
  }

  updateCard(card: Card) {
    const index = this.cardService.findCardIndex(card.id);
    if (index === null) { return; }
    this.cardService.update(card, index).then(() => {
      this.updateResults(card);
      this.expandCard(card);
      this.notificationService.push({ message: 'Card updated!', success: true });
    })
    .catch((err) => {
      this.notificationService.push({
        message: 'Card update failed! ' + err, success: false
      });
    });
  }

  deleteCard(id: number) {
    const index = this.cardService.findCardIndex(id);
    if (index === null) { return; }
    this.cardService.delete(id, index).then(() => {
      this.notificationService.push({ message: 'Card deleted!', success: true });
    })
    .catch((err) => {
      this.notificationService.push({
        message: 'Failed to delete card! ' + err, success: false
      });
    });
  }

  backPressed() {
    if (!this.expanded && this.expandedCard === null) {
      this.router.navigateByUrl('');
      return;
    }
    this.handleBack();
  }

  handleBack() {
    this.expanded = false;
    this.expandedCard = null;
  }

  handleUpdateCard(card: Card) {
    this.updateCard(card);
  }

  handleCardDeleted(card: Card) {
    this.deleteCard(card.id);
    this.handleBack();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe()); 
  }

}
