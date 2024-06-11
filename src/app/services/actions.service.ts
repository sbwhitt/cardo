import { Injectable } from '@angular/core';
import { Action } from '../models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private undos: Action[] = [];
  private redos: Action[] = [];

  activeUndo = new Subject<Action>();
  activeRedo = new Subject<Action>();

  constructor() { }

  pushUndo(action: Action) {
    this.undos.push(action);
  }

  pushRedo(action: Action) {
    this.redos.push(action);
  }

  applyUndo() {
    const undo = this.undos.pop();
    if (!undo) { return; }
    this.redos.push(undo);
    this.activeUndo.next(undo);
  }

  applyRedo() {
    const redo = this.redos.pop();
    if (!redo) { return; }
    this.undos.push(redo);
    this.activeRedo.next(redo);
  }

  reset() {
    this.resetUndos();
    this.resetRedos();
  }

  resetUndos() {
    this.undos = [];
  }

  resetRedos() {
    this.redos = [];
  }
}
