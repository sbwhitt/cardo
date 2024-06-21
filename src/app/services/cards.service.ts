import { Injectable } from '@angular/core';
import { Card } from '../models';
import { DbService } from './db.service';
import { EnvironmentService } from './environment.service';
import * as cardsLocal from './sample.json';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private locals: Card[] | null = null;

  constructor(
    private dbService: DbService,
    private envService: EnvironmentService
  ) {}

  async get(sample?: boolean): Promise<Card[]> {
    if (this.locals && this.locals.length > 0) { return this.locals; }
    if (sample || this.envService.isLocal()) {
      // @ts-ignored
      this.locals = cardsLocal.cards;
      return this.locals ? this.locals : [];
    }
    return this.dbService.getCards().then((res: any) => {
      return Object.values(res);
    });
  }

  async update(card: Card): Promise<void> {
    if (this.envService.isLocal()) {
      this.locals = await this.get();
      this.locals[card.id] = card;
      return;
    }
    return this.dbService.updateCard(card);
  }
}
