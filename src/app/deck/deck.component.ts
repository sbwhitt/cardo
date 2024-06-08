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
  cards: Card[] = [];
  ready = false;

  constructor(
    private dbService: DbService
  ) {}

  ngOnInit() {
    this.dbService.getCards().then((res: any) => this.cards = Object.values(res));
  }

  handleSwiped(direction: boolean) {
    direction ? console.log("right") : console.log("left");
    this.cards.pop();
  }
}
