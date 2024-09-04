import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { EnvironmentService } from './environment.service';
import { NotificationsService } from './notifications.service';
import { Set } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SetsService {
  sets: Set[] | null = null;

  constructor(
    private dbService: DbService,
    private envService: EnvironmentService,
    private notificationService: NotificationsService
  ) {}

  private parse(raw: any[]): Set[] {
    //@ts-ignore
    return Object.values(raw).map((s) => {
      s.cards = Object.values(s.cards);
      return s;
    });
  }

  async loadSets(): Promise<Set[]> {
    return this.dbService.getSets().then((sets) => {
      //@ts-ignore
      this.sets = sets ? this.parse(sets) : [];
      return this.sets;
    });
  }

  getSets(): Set[] {
    return this.sets ? this.sets : [];
  }

  getSet(id: number): Set | null {
    const set = this.sets?.find((s) => s.id === id);
    return set ? set : null;
  }

  async createSet(set: Set): Promise<void> {}

  async updateSet(set: Set): Promise<void> {
    return this.dbService.updateSet(set);
  }

  async deleteSet(id: number): Promise<void> {}

}
