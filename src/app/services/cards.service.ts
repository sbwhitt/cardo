import { Injectable } from '@angular/core';
import { Card } from '../models';
import { DbService } from './db.service';
import { EnvironmentService } from './environment.service';
import * as cardsLocal from './sample.json';
import { Subject } from 'rxjs';
import { NotificationsService } from './notifications.service';

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
    private envService: EnvironmentService,
    private notificationsService: NotificationsService
  ) {}

  async get(sample?: boolean): Promise<Card[]> {
    if (sample) { this.locals = null; }
    if (this.locals && this.locals.length > 0) { return this.locals; }
    if (sample || this.envService.isLocal()) {
      // @ts-ignored
      this.locals = cardsLocal.cards;
      this.notificationsService.push({ message: "Samples loaded!", success: true })
      return this.locals ? this.locals : [];
    }
    return this.dbService.getCards().then((res: any) => {
      this.locals = Object.values(res);
      return this.locals;
    });
  }

  async update(card: Card, index: number): Promise<void> {
    this.locals = await this.get();
    if (this.envService.isLocal()) {
      this.locals[index] = card;
      return;
    }
    return this.dbService.updateCard(card).then(() => {
      if (!this.locals) { return; }
      this.locals[index] = card
    });
  }

  async add(card: Card): Promise<void> {
    this.locals = await this.get();
    card.id = this.locals[this.locals.length-1].id+1;
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

  async delete(id: number, index: number): Promise<void> {
    this.locals = await this.get();
    if (this.envService.isLocal()) {
      this.locals.splice(index, 1);
      return;
    }
    return this.dbService.deleteCard(id)
      .then(() => {
        this.locals?.splice(index, 1);
      });
  }
}
