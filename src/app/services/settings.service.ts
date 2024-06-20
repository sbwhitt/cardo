import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private dealStarred = false;
  private baseFront = true;
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

  getBaseFront(): boolean {
    return this.baseFront;
  }

  setBaseFront(val: boolean) {
    this.baseFront = val;
  }

  getDeckSize(): number {
    return this.deckSize;
  }

  setDeckSize(size: number) {
    this.deckSize = size;
  }
}
