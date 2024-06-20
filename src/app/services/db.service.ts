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

  async getCards(): Promise<object | null> {
    console.log(this.getCardsLocation());
    const db = getDatabase(this.authService.firebaseApp);
    const dbRef = ref(db, this.getCardsLocation());
    return await get(dbRef).then((snap) => {
      if (snap.exists()) { return snap.toJSON(); }
      return null;
    });
  }

  async updateCard(card: Card): Promise<void> {
    const db = getDatabase(this.authService.firebaseApp);
    return set(ref(db, this.getCardsLocation() + '/' + card.id), card);
  }
}
