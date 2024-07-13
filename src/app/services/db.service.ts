import { Injectable } from '@angular/core';
import { Database, get, getDatabase, ref, remove, set } from 'firebase/database';
import { Card, Settings } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private authService: AuthService
  ) {}

  private getCardsLocation(): string {
    return this.authService.user + '/cards';
  }

  private getDb(): Database | null {
    const fbApp = this.authService.getFirebaseApp();
    return fbApp ?
      getDatabase(fbApp) :
      null;
  }

  private async getLanguage(type: 'base_lang' | 'goal_lang'): Promise<object | null> {
    const db = this.getDb();
    if (!db) { return null; }
    const dbRef = ref(db, this.authService.user + '/' + type);
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  async getBaseLanguage(): Promise<object | null> {
    return this.getLanguage('base_lang');
  }

  async getGoalLanguage(): Promise<object | null> {
    return this.getLanguage('goal_lang');
  }

  async getSettings(): Promise<any | null> {
    const db = this.getDb();
    if (!db) { return null; }
    const dbRef = ref(db, this.authService.user + '/settings');
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  async setSettings(settings: Settings): Promise<void> {
    const db = this.getDb();
    if (!db) { return; }
    const dbRef = ref(db, this.authService.user + '/settings');
    return await set(dbRef, settings);
  }

  async getCards(): Promise<object | null> {
    const db = this.getDb();
    if (!db) { return null; }
    const dbRef = ref(db, this.getCardsLocation());
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  // same for now, but may be used differently in the future

  async updateCard(card: Card): Promise<void> {
    const db = this.getDb();
    if (!db) { return; }
    return set(ref(db, this.getCardsLocation() + '/' + card.id), card);
  }

  async addCard(card: Card): Promise<void> {
    const db = this.getDb();
    if (!db) { return; }
    return set(ref(db, this.getCardsLocation() + '/' + card.id), card);
  }

  async deleteCard(id: number): Promise<void> {
    const db = this.getDb();
    if (!db) { return; }
    return remove(ref(db, this.getCardsLocation() + '/' + id));
  }
}
