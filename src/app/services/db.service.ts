import { Injectable } from '@angular/core';
import { Database, get, getDatabase, ref, remove, set } from 'firebase/database';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { EnvironmentService } from './environment.service';
import { Card, Set, Settings } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private authService: AuthService,
    private envService: EnvironmentService,
    private router: Router
  ) {}

  private getCardsLocation(): string {
    return this.authService.user + '/cards';
  }

  private getSetsLocation(): string {
    return this.authService.user + '/sets';
  }

  private getDb(): Database | null {
    const fbApp = this.authService.getFirebaseApp();
    if (!fbApp) { this.router.navigateByUrl('/auth'); }
    return fbApp ?
      getDatabase(fbApp) :
      null;
  }

  private getLocalLang(type: 'base_lang' | 'goal_lang'): string {
    return type === 'base_lang' ? 'en' : 'de';
  }

  private async getLanguage(type: 'base_lang' | 'goal_lang'): Promise<object | string | null> {
    if (this.envService.isLocal()) {
      return this.getLocalLang(type);
    }
    const db = this.getDb();
    if (!db) { return null; }
    const dbRef = ref(db, this.authService.user + '/' + type);
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  async getBaseLanguage(): Promise<object | string | null> {
    return this.getLanguage('base_lang');
  }

  async getGoalLanguage(): Promise<object | string | null> {
    return this.getLanguage('goal_lang');
  }

  async getSettings(): Promise<any | null> {
    const db = this.getDb();
    if (!db || this.envService.isLocal()) { return null; }
    const dbRef = ref(db, this.authService.user + '/settings');
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  async setSettings(settings: Settings): Promise<void> {
    const db = this.getDb();
    if (!db || this.envService.isLocal()) { return; }
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

  async getSets(): Promise<object | null> {
    const db = this.getDb();
    if (!db) { return null; }
    const dbRef = ref(db, this.getSetsLocation());
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  async updateSet(updatedSet: Set): Promise<void> {
    const db = this.getDb();
    if (!db) { return; }
    return set(ref(db, this.getSetsLocation() + '/' + updatedSet.id), updatedSet);
  }

  async addSet(newSet: Set): Promise<void> {
    const db = this.getDb();
    if (!db) { return; }
    return set(ref(db, this.getSetsLocation() + '/' + newSet.id), newSet);
  }

}
