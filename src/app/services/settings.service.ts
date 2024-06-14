import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private dealStarred = false;
  private englishFront = true;
  private deckSize = 10;

  dealStarredChanged = new Subject<void>();

  constructor() { }

  getDealStarred(): boolean {
    return this.dealStarred;
  }

  setDealStarred(val: boolean) {
    this.dealStarred = val;
    this.dealStarredChanged.next();
  }

  getEnglishFront(): boolean {
    return this.englishFront;
  }

  setEnglishFront(val: boolean) {
    this.englishFront = val;
  }

  getDeckSize(): number {
    return this.deckSize;
  }

  setDeckSize(size: number) {
    this.deckSize = size;
  }
}
