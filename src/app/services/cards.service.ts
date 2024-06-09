import { Injectable } from '@angular/core';
import { Card } from '../models/cards';
import { DbService } from './db.service';
import { EnvironmentService } from './environment.service';
import * as cardsLocal from '../../../parse/output.json';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private cards: Card[] | null = null;

  constructor(
    private dbService: DbService,
    private envService: EnvironmentService
  ) {}

  async getCards(): Promise<Card[]> {
    if (this.cards && this.cards.length > 0) { return new Promise(() => this.cards); }
    if (this.envService.isLocal()) {
      // @ts-ignore
      return cardsLocal.cards
        .map((card) => { return { ...card, viewed: false } });
    }
    return this.dbService.getCards().then((res: any) => {
      return Object.values(res);
    });
  }
}
