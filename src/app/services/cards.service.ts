import { Injectable } from '@angular/core';
import { Card } from '../models';
import { DbService } from './db.service';
import { EnvironmentService } from './environment.service';
import * as cardsLocal from './sample.json';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private locals: Card[] | null = null;

  public cardAdded = new Subject<Card>();

  public typeOptions = [
    'masculine',
    'feminine',
    'neuter',
    'verb',
    'other'
  ];

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
      this.locals = Object.values(res);
      return this.locals;
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

  async add(card: Card): Promise<any> {
    this.locals = await this.get();
    card.id = this.locals.length;
    if (this.envService.isLocal()) {
      this.locals.push(card);
      this.cardAdded.next(card);
      return;
    }
    return this.dbService.addCard(card)
    .then(() => {
      this.locals?.push(card);
      this.cardAdded.next(card)
    });
  }
}
