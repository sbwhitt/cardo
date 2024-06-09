import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { Card } from '../models/cards';
import { CardsService } from '../services/cards.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss'
})
export class DeckComponent {
  loading = false;
  cards: Card[] = [];
  pile: Card[] = [];
  deck: Card[] = [];

  constructor(
    private cardService: CardsService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.cardService.getCards().then((res: Card[]) => {
      this.cards = res;
      this.pile = structuredClone(this.cards);
      this.deck = this.deal(this.pile);
      this.loading = false;
    });
  }

  getDeckSize(): number {
    return this.settingsService.getDeckSize();
  }

  // https://stackoverflow.com/a/12646864
  shuffle(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  deal(cards: Card[]): Card[] {
    const ret: Card[] = [];
    for (let i = 0; i < this.getDeckSize(); i++) {
      if (cards.length === 0) { return ret; }
      const choice = Math.floor(Math.random()*cards.length);
      cards.splice(choice, 1);
      ret.push(cards[choice]);
    }
    return ret;
  }

  handleSwiped(direction: boolean) {
    this.deck.pop();
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
