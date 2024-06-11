import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { Action, Card } from '../models';
import { CardsService } from '../services/cards.service';
import { SettingsService } from '../services/settings.service';
import { ActionsService } from '../services/actions.service';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
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
    this.cardService.get().then((res: Card[]) => {
      this.cards = res;
      this.pile = structuredClone(this.cards);
      this.dealNewDeck();
      this.loading = false;
    });
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

  getDeckSize(): number {
    return this.settingsService.getDeckSize();
  }

  getEnglishFirst(): boolean {
    return this.settingsService.getEnglishFront();
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
    this.missed = [];
    const ret: Card[] = [];
    for (let i = 0; i < this.getDeckSize(); i++) {
      if (cards.length === 0) { return ret; }
      const choice = Math.floor(Math.random()*cards.length);
      cards.splice(choice, 1);
      ret.push(cards[choice]);
    }
    return ret;
  }

  dealMissed(): void {
    this.deck = this.missed;
    this.shuffle(this.deck);
    this.missed = [];
    this.actionsService.reset();
  }

  dealSameDeck(): void {
    this.deck = structuredClone(this.currentDeck);
    this.shuffle(this.deck);
    this.missed = [];
    this.actionsService.reset();
  }

  dealNewDeck(): void {
    this.deck = this.deal(this.pile);
    this.currentDeck = structuredClone(this.deck);
    this.missed = [];
    this.actionsService.reset();
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

  handleStarred(val: boolean, card: Card, index: number) {
    card.starred = val;
    this.cards[card.id] = card;
    this.currentDeck[index] = card;
    this.cardService.update(card);
  }

  getColor(type: string): string {
    switch (type) {
      case 'masculine': { return 'lightblue'; }
      case 'feminine': { return 'lightpink'; }
      case 'neuter': { return 'palegoldenrod'; }
      case 'verb': { return 'plum'; }
      case 'other': { return 'lightgreen'; }
      default: { return 'gray'; }
    }
  }
}
