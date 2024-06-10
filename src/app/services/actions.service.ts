import { Injectable } from '@angular/core';
import { Action } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private actions: Action[] = [];

  constructor() { }

  push(action: Action) {
    this.actions.push(action);
  }

  pop(): Action | null {
    const ret = this.actions.pop();
    return ret ? ret : null;
  }
}
