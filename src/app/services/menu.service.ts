import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  settingsOpen = new Subject<boolean>();
  addCardOpen = new Subject<boolean>();

  constructor() { }

  openSettings() {
    this.settingsOpen.next(true);
  }

  closeSettings() {
    this.settingsOpen.next(false);
  }

  openAddCard() {
    this.addCardOpen.next(true);
  }

  closeAddCard() {
    this.addCardOpen.next(false);
  }
}
