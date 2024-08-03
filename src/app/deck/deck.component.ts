import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CardComponent } from '../card/card.component';
import { Action, Card } from '../models';
import { ActionsService } from '../services/actions.service';
import { CardsService } from '../services/cards.service';
import { SettingsService } from '../services/settings.service';
import { MenuService } from '../services/menu.service';
import { NotificationsService } from '../services/notifications.service';
import { TypeColorPipe } from '../pipes/type-color.pipe';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NavbarComponent, CardComponent, TypeColorPipe],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss'
})
export class DeckComponent {
  loading = false;

  cards: Card[] = [];       // all cards from db, source of truth, immutable
  pile: Card[] = [];        // working pile of all cards, mutable

  deck: Card[] = [];        // working deck, mutable
  currentDeck: Card[] = []; // current deck stored, immutable
  missed: Card[] = [];      // missed cards within active deck

  deckProgress = '0%';

  constructor(
    private actionsService: ActionsService,
    private cardService: CardsService,
    private menuService: MenuService,
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
    this.actionsService.activeUndo.subscribe((res) => this.applyUndo(res));
    this.actionsService.activeRedo.subscribe((res) => this.applyRedo(res));
    this.settingsService.dealStarredChanged.subscribe(() => this.initAndDeal());
    this.cardService.get().then((res: Card[]) => {
      this.cards = res;
      this.initAndDeal();
      this.loading = false;
    }).catch(() => {
      this.notificationService.push({ message: 'Couldn\'t load cards!', success: false });
    });
    this.cardService.cardAdded.subscribe(() => {
      this.initAndDeal();
    });
  }

  initPile() {
    this.settingsService.getDealStarred() ?
      this.pile = structuredClone(this.getStarred()) :
      this.pile = structuredClone(this.cards);
  }

  initAndDeal() {
    this.initPile();
    this.dealNewDeck();
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

  getStarred(): Card[] {
    return this.cards.filter((card) => card.starred);
  }

  applyUndo(action: Action) {
    if (!action.direction) {
      this.missed.splice(
        this.missed.findIndex((m) => m.id === action.card.id), 1
      );
    }
    this.deck.push(action.card);
    this.setDeckProgress();
  }

  applyRedo(action: Action) {
    this.handleSwiped(action.direction);
  }

  refreshWorkingCards() {
    for (let local of [this.currentDeck, this.deck, this.missed]) {
      for (let i = 0; i < local.length; i++) {
        const index = this.findCardIndex(local[i].id);
        if (index === null) { return; }
        local[i] = this.cards[index];
      }
    }
  }

  removeFromWorkingCards(id: number) {
    for (let local of [this.currentDeck, this.deck, this.missed]) {
      for (let i = 0; i < local.length; i++) {
        if (local[i].id !== id) { continue; }
        local.splice(i, 1);
        break;
      }
    }
  }

  updateCard(card: Card) {
    const index = this.findCardIndex(card.id);
    if (index === null) { return; }
    this.cardService.update(card, index).then(() => {
      this.notificationService.push({ message: 'Card updated!', success: true });
      this.refreshWorkingCards();
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
      this.actionsService.reset();
      this.removeFromWorkingCards(id);
    })
    .catch((err) => {
      this.notificationService.push({
        message: 'Failed to delete card! ' + err, success: false
      });
    });
  }

  getbaseFront(): boolean {
    return this.settingsService.getBaseFront();
  }

  getDeckSize(): number {
    return this.settingsService.getDeckSize();
  }

  // https://stackoverflow.com/a/12646864
  // in place shuffle
  shuffle(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  // deals from inputted array, removes dealt items from source
  deal(cards: Card[]): Card[] {
    const ret: Card[] = [];
    for (let i = 0; i < this.getDeckSize(); i++) {
      if (cards.length === 0) { return ret; }
      const choice = Math.floor(Math.random()*cards.length);
      ret.push(cards[choice]);
      cards.splice(choice, 1);
    }
    return ret;
  }

  initDeck() {
    this.missed = [];
    this.actionsService.reset();
    this.setDeckProgress();
  }

  dealMissed(): void {
    this.deck = this.missed;
    this.shuffle(this.deck);
    this.initDeck();
  }

  dealSameDeck(): void {
    this.deck = structuredClone(this.currentDeck);
    this.shuffle(this.deck);
    this.initDeck();
  }

  dealNewDeck(): void {
    this.deck = this.deal(this.pile);
    this.currentDeck = structuredClone(this.deck);
    this.initDeck();
  }

  handleSwiped(direction: boolean) {
    const card = this.deck.pop();
    if (!card) { return; }
    // right == true, left == false
    this.actionsService.pushUndo({
      direction: direction,
      card: card
    });
    this.actionsService.resetRedos();
    if (!direction) { this.missed.push(card); }
    this.setDeckProgress();
  }

  setDeckProgress() {
    const deckSize = this.currentDeck.length;
    this.deckProgress = 100*((1 + Math.abs(this.deck.length - deckSize)) / deckSize) + '%';
  }

  handleCardUpdated(newCard: Card) {
    this.updateCard(newCard);
  }

  handleCardDeleted(card: Card) {
    this.deleteCard(card.id);
  }

  backPressed() {
    this.router.navigateByUrl('');
  }

  undoPressed() {
    this.actionsService.applyUndo();
  }

  addPressed() {
    this.menuService.openAddCard();
  }

  redoPressed() {
    this.actionsService.applyRedo();
  }
}
