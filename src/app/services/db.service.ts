import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { get, getDatabase, ref, set } from 'firebase/database';
import { firebaseConfig } from '../../environment/environment';
import { Card } from '../models/cards';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  app: FirebaseApp = initializeApp(firebaseConfig);

  constructor() {}

  getCards() {
    const db = getDatabase(this.app);
    const dbRef = ref(db, 'cards');
    return get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  writeCards(cards: Card[]) {
    const db = getDatabase(this.app);
    const dbRef = ref(db, 'cards');
    set(dbRef, cards);
  }
}
