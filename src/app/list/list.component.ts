import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../loading/loading.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CardComponent } from '../card/card.component';
import { CardsService } from '../services/cards.service';
import { NotificationsService } from '../services/notifications.service';
import { SettingsService } from '../services/settings.service';
import { TypeColorPipe } from '../pipes/type-color.pipe';
import { Card } from '../models';

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
  maxCards = 100;
  cards: Card[] = [];
  results: Card[] = [];
  expanded = false;
  expandedCard: Card | null = null;
  query = new FormControl('');

  constructor(
    private cardService: CardsService,
    private notificationService: NotificationsService,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.settingsService.loading ?
      this.settingsService.loaded.subscribe(() => this.init()) :
      this.init();
  }

  init() {
    this.cardService.get().then((res: Card[]) => {
      this.cards = res;
      this.results = this.cards;
      this.loading = false;
    })
    .catch((err) => alert('Failed to get cards from database! ' + err));
    this.query.valueChanges.subscribe((query) => this.filter(query));
  }

  getBaseFront(): boolean {
    return this.settingsService.getBaseFront();
  }

  filter(query: string | null) {
    if (!query) {
      this.results = this.cards;
      return;
    }
    this.results = this.cards.filter((card) => {
      return card.base.toLowerCase().includes(query.toLowerCase()) ||
            card.goal.toLowerCase().includes(query.toLowerCase());
    });
  }

  findCardIndex(id: number): number | null {
    let start = 0;
    let end = this.cards.length-1;
    while (end >= start) {
      let mid = Math.floor((end + start)/2);
      const hit = this.cards[mid];
      if (hit.id === id) { return mid; }
      if (hit.id < id) { start = mid+1; }
      else if (hit.id > id) { end = mid-1; }
    }
    this.notificationService.push({ message: 'Couldn\'t find card!', success: false });
    return null;
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
    const index = this.findCardIndex(card.id);
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
    const index = this.findCardIndex(id);
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
}
