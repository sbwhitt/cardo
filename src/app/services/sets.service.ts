import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { CardsService } from './cards.service';
import { DbService } from './db.service';
import { EnvironmentService } from './environment.service';
import { NotificationsService } from './notifications.service';
import { Card, Set } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SetsService {
  sets: Set[] | null = null;

  colorOptions: string[] = [
    'plum',
    'lightgreen',
    'palegoldenrod',
    'lightpink',
    'lightblue'
  ];

  constructor(
    private cardsService: CardsService,
    private dbService: DbService,
    private envService: EnvironmentService,
    private notificationService: NotificationsService
  ) {}

  private parse(raw: any[]): Set[] {
    //@ts-ignore
    return Object.values(raw).map((s) => {
      s.cards = s.cards ? Object.values(s.cards) : [];
      return s;
    });
  }

  async loadSets(): Promise<Set[]> {
    if (this.sets) { return this.sets; }
    return this.dbService.getSets().then((sets) => {
      //@ts-ignore
      this.sets = sets ? this.parse(sets) : [];
      return this.sets;
    });
  }

  async loadSetFromParams(map: ParamMap): Promise<Set | null> {
    const setId = map.get('setId');
    if (setId === null) { return null; }
    return this.getSet(Number.parseInt(setId));
  }

  getSets(): Set[] {
    return this.sets ? this.sets : [];
  }

  async getSet(setId: number): Promise<Set | null> {
    if (!this.sets) { await this.loadSets(); }
    const set = this.sets?.find((s) => s.id === setId);
    return set ? set : null;
  }

  async getCards(setId: number): Promise<Card[]> {
    const set = await this.getSet(setId);
    if (!set) { return []; }
    const cards: Card[] = [];
    set.cards.forEach((id) => {
      const card = this.cardsService.getCard(id);
      if (card !== null) { cards.push(card); }
    });
    return cards.sort((a, b) => a.id - b.id);
  }

  async add(set: Set): Promise<void> {
    this.sets = await this.loadSets();
    if (!this.sets) {
      this.notificationService.push({
        message: 'Failed to add set!',
        success: false
      });
      return;
    }
    set.id = this.sets.length === 0 ?
      0 : set.id = this.sets[this.sets.length-1].id+1;
    // if (this.envService.isLocal()) {
    //   this.sets.push(set);
    //   return;
    // }
    return this.dbService.addSet(set)
      .then(() => {
        this.sets?.push(set);
      });
  }

  async updateSet(set: Set): Promise<void> {
    return this.dbService.updateSet(set)
      .then(() => {
        this.notificationService.push({ message: 'Set updated!', success: true });
      })
      .catch(() => {
        this.notificationService.push({ message: 'Failed to update set!', success: false });
      });
  }

  async deleteSet(id: number): Promise<void> {}

}
