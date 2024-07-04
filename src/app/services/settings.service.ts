import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbService } from './db.service';
import { Settings } from '../models';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Settings = {
    base_front: true,
    deal_starred: false,
    deck_size: 10
  };

  loaded = new Subject<void>();
  dealStarredChanged = new Subject<void>();

  constructor(
    private dbService: DbService,
    private notificationsService: NotificationsService
  ) {
    this.dbService.getSettings().then((res) => {
      if (!res) { return; }
      this.settings = res;
      this.loaded.next();
    });
  }

  private async update(updated: Settings): Promise<void> {
    return this.dbService.setSettings(updated).then(() => {
      this.settings = updated;
      this.notificationsService.push({ message: 'Settings updated!', success: true });
    }).catch(() => {
      this.notificationsService.push({ message: 'Failed to update settings!', success: false });
    });
  }

  getDealStarred(): boolean {
    return this.settings.deal_starred;
  }

  setDealStarred(val: boolean) {
    const updated = {
      ...this.settings,
      deal_starred: val
    };
    this.update(updated).then(() => this.dealStarredChanged.next());
  }

  getBaseFront(): boolean {
    return this.settings.base_front;
  }

  setBaseFront(val: boolean) {
    const updated = {
      ...this.settings,
      base_front: val
    };
    this.update(updated);
  }

  getDeckSize(): number {
    return this.settings.deck_size;
  }

  setDeckSize(size: number) {
    const updated = {
      ...this.settings,
      deck_size: size
    };
    this.update(updated);
  }
}
