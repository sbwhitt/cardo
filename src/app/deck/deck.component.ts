import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

interface Card {
  front: string;
  back: string;
  color: string;
}

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss'
})
export class DeckComponent {
  colors = ['lightpink', 'lightgreen', 'lightblue', 'plum', 'lightyellow'];

  cards: Card[] = [];
  ready = false;

  ngOnInit() {
    for (let color of this.colors) {
      this.cards.push({
        front: 'Front',
        back: 'Back',
        color: color
      });
    }
  }

  handleSwiped(direction: boolean) {
    direction ? console.log("right") : console.log("left");
    this.cards.pop();
  }
}
