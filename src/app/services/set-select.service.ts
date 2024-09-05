import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetSelectService {
  setSelectOpened = new Subject<number>();
  setSelectClosed = new Subject<void>();

  constructor() { }

  open(cardId: number) {
    this.setSelectOpened.next(cardId);
  }

  close() {
    this.setSelectClosed.next();
  }
}
