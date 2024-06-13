import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private dealFromStarred = false;
  private englishFront = true;
  private deckSize = 10;

  constructor() { }

  getDealFromStarred(): boolean {
    return this.dealFromStarred;
  }

  setDealFromStarred(val: boolean) {
    this.dealFromStarred = val;
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
