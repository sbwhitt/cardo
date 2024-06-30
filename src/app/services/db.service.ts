import { Injectable } from '@angular/core';
import { get, getDatabase, ref, set } from 'firebase/database';
import { Card } from '../models';
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

  private async getLanguage(type: 'base_lang' | 'goal_lang'): Promise<object | null> {
    const db = getDatabase(this.authService.firebaseApp);
    const dbRef = ref(db, this.authService.user + "/" + type);
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

  async getCards(): Promise<object | null> {
    const db = getDatabase(this.authService.firebaseApp);
    const dbRef = ref(db, this.getCardsLocation());
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  // same for now, but may be used differently in the future

  async updateCard(card: Card): Promise<void> {
    const db = getDatabase(this.authService.firebaseApp);
    return set(ref(db, this.getCardsLocation() + '/' + card.id), card);
  }

  async addCard(card: Card): Promise<void> {
    const db = getDatabase(this.authService.firebaseApp);
    return set(ref(db, this.getCardsLocation() + '/' + card.id), card);
  }
}
