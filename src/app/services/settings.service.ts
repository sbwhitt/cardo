import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  deckSize = 1;

  constructor() { }

  getDeckSize(): number {
    return this.deckSize;
  }

  setDeckSize(size: number) {
    this.deckSize = size;
  }
}
