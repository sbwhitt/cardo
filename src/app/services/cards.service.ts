import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as cardsLocal from './sample.json';
import { DbService } from './db.service';
import { EnvironmentService } from './environment.service';
import { NotificationsService } from './notifications.service';
import { Card, Set } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private cards: Card[] | null = null;

  cardAdded = new Subject<Card>();
  typeOptions = [
    'masculine',
    'feminine',
    'neuter',
    'verb',
    'other'
  ];

  constructor(
    private dbService: DbService,
    private envService: EnvironmentService,
    private notificationService: NotificationsService
  ) {}

  async loadCards(set?: Set): Promise<Card[]> {
    if (this.cards && this.cards.length > 0) { return this.cards; }
    if (this.envService.isLocal()) {
      // @ts-ignored
      this.cards = cardsLocal.cards;
      this.notificationService.push({ message: "Sample cards loaded!", success: true })
      return this.cards ? this.cards : [];
    }
    return this.dbService.getCards()
      .then((res: any) => {
        this.cards = Object.values(res);
        this.notificationService.push({ message: 'Cards loaded!', success: true });
        return this.cards;
      });
  }

  getCard(cardId: number): Card | null {
    const index = this.findCardIndex(cardId);
    if (index === null || !this.cards) { return null; }
    return this.cards[index];
  }

  getCards(): Card[] {
    return this.cards ? this.cards: [];
  }

  getStarred(): Card[] {
    return this.cards ? this.cards.filter((card) => card.starred) : [];
  }

  // binary search
  findCardIndex(id: number): number | null {
    const cards = this.getCards();
    let start = 0;
    let end = cards.length-1;
    while (end >= start) {
      let mid = Math.floor((end + start)/2);
      const hit = cards[mid];
      if (hit.id === id) { return mid; }
      if (hit.id < id) { start = mid+1; }
      else if (hit.id > id) { end = mid-1; }
    }
    this.notificationService.push({ message: 'Couldn\'t find card!', success: false });
    return null;
  }

  async update(card: Card, index: number): Promise<void> {
    this.cards = await this.loadCards();
    if (this.envService.isLocal()) {
      this.cards[index] = card;
      return;
    }
    return this.dbService.updateCard(card)
      .then(() => {
        if (!this.cards) { return; }
        this.cards[index] = card
      });
  }

  async add(card: Card): Promise<void> {
    this.cards = await this.loadCards();
    card.id = this.cards[this.cards.length-1].id+1;
    if (this.envService.isLocal()) {
      this.cards.push(card);
      this.cardAdded.next(card);
      return;
    }
    return this.dbService.addCard(card)
      .then(() => {
        this.cards?.push(card);
        this.cardAdded.next(card)
      });
  }

  async delete(id: number, index: number): Promise<void> {
    this.cards = await this.loadCards();
    if (this.envService.isLocal()) {
      this.cards.splice(index, 1);
      return;
    }
    return this.dbService.deleteCard(id)
      .then(() => {
        this.cards?.splice(index, 1);
      });
  }
}
