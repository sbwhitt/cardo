import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { Action, Card } from '../models';
import { CardsService } from '../services/cards.service';
import { SettingsService } from '../services/settings.service';
import { ActionsService } from '../services/actions.service';
import { TypeColorPipe } from '../pipes/type-color.pipe';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, CardComponent, TypeColorPipe],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss'
})
export class DeckComponent {
  loading = false;

  cards: Card[] = [];       // all cards form db, source of truth, immutable
  pile: Card[] = [];        // working pile of all cards, mutable

  deck: Card[] = [];        // working deck, mutable
  currentDeck: Card[] = []; // current deck stored, immutable
  missed: Card[] = [];      // missed cards within active deck

  constructor(
    private actionsService: ActionsService,
    private cardService: CardsService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.actionsService.activeUndo.subscribe((res) => this.applyUndo(res));
    this.actionsService.activeRedo.subscribe((res) => this.applyRedo(res));
    this.settingsService.dealStarredChanged.subscribe(() => this.initAndDeal());
    this.cardService.get().then((res: Card[]) => {
      this.cards = res;
      this.initAndDeal();
      this.loading = false;
    })
    .catch((err) => alert('Failed to get cards from database! ' + err));
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
  }

  applyRedo(action: Action) {
    this.handleSwiped(action.direction);
  }

  refreshWorkingCards() {
    for (let local of [this.currentDeck, this.deck, this.missed]) {
      for (let i = 0; i < local.length; i++) { local[i] = this.cards[local[i].id]; }
    }
  }

  updateCard(card: Card) {
    this.cardService.update(card).then(() => {
      this.cards[card.id] = card;
      this.refreshWorkingCards();
    })
    .catch((err) => alert('Card update failed! ' + err));
  }

  getBaseFirst(): boolean {
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
  }

  getDeckProgress() {
    return (1 + Math.abs(this.deck.length - this.getDeckSize())) * 10 + '%';
  }

  handleCardUpdated(newCard: Card) {
    this.updateCard(newCard);
  }
}
