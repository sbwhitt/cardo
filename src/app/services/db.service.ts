import { Injectable } from '@angular/core';
import { DataSnapshot, get, getDatabase, ref, set } from 'firebase/database';
import { Card } from '../models/cards';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private authService: AuthService
  ) {}

  async getCards(): Promise<object | null> {
    const db = getDatabase(this.authService.firebaseApp);
    const dbRef = ref(db, 'cards');
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  async updateCard(card: Card): Promise<void> {
    const db = getDatabase(this.authService.firebaseApp);
    return set(ref(db, 'cards/' + card.id), card);
  }
}
