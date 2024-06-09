import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { Card } from '../models/cards';
import { CardsService } from '../services/cards.service';

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

  constructor(
    private cardService: CardsService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.cardService.getCards().then((res: Card[]) => {
      this.cards = structuredClone(res);
      this.shuffle(this.cards);
      this.loading = false;
    });
  }

  handleSwiped(direction: boolean) {
    direction ? console.log("right") : console.log("left");
    this.cards.pop();
  }

  getColor(type: string): string {
    switch (type) {
      case 'masculine': { return 'lightblue'; }
      case 'feminine': { return 'lightpink'; }
      case 'neuter': { return 'palegoldenrodyellow'; }
      case 'verb': { return 'plum'; }
      case 'other': { return 'lightgreen'; }
      default: { return 'gray'; }
    }
  }

  // https://stackoverflow.com/a/12646864
  shuffle(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}
