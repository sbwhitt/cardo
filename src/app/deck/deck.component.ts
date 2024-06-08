import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { DbService } from '../services/db.service';
import { Card } from '../models/cards';

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
    private dbService: DbService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.dbService.getCards()
      .then((res: any) => {
        this.cards = Object.values(res);
        this.shuffle(this.cards);
        console.log(this.cards);
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
      case 'neuter': { return 'lightyellow'; }
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
