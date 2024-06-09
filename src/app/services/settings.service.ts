import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private deckSize = 10;
  private englishFront = true;

  constructor() { }

  getDeckSize(): number {
    return this.deckSize;
  }

  setDeckSize(size: number) {
    this.deckSize = size;
  }

  getEnglishFront(): boolean {
    return this.englishFront;
  }

  setEnglishFront(val: boolean) {
    this.englishFront = val;
  }
}
