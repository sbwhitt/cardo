import { Injectable } from '@angular/core';
import { get, getDatabase, ref, set } from 'firebase/database';
import { Card } from '../models/cards';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private authService: AuthService
  ) {}

  getCards() {
    const db = getDatabase(this.authService.firebaseApp);
    const dbRef = ref(db, 'cards');
    return get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  writeCards(cards: Card[]) {
    const db = getDatabase(this.authService.firebaseApp);
    const dbRef = ref(db, 'cards');
    set(dbRef, cards);
  }
}
