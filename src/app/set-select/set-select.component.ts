import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { SetsService } from '../services/sets.service';
import { SetSelectService } from '../services/set-select.service';
import { Set } from '../models';

@Component({
  selector: 'app-set-select',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './set-select.component.html',
  styleUrl: './set-select.component.scss'
})
export class SetSelectComponent {
  subs: Subscription[] = [];

  open = false;
  selection!: number;
  sets: Set[] = [];

  constructor(
    private setsService: SetsService,
    private setSelectService: SetSelectService
  ) {}

  ngOnInit() {
    this.subs = [
      this.setSelectService.setSelectOpened.subscribe((cardId) => this.handleOpen(cardId)),
      this.setSelectService.setSelectClosed.subscribe(() => this.open = false)
    ];
  }

  handleOpen(cardId: number) {
    this.open = true;
    this.selection = cardId;
    this.setsService.loadSets()
      .then((sets) => {
        this.sets = sets;
      });
  }

  addSelectionTo(set: Set) {
    set.cards.push(this.selection);
    this.setsService.updateSet(set);
  }

  removeSelectionFrom(set: Set) {
    set.cards.splice(
      set.cards.findIndex((c) => c === this.selection), 1);
    this.setsService.updateSet(set);
  }

  toggleSelectionFor(set: Set) {
    set.cards.includes(this.selection) ?
      this.removeSelectionFrom(set) :
      this.addSelectionTo(set);
  }

  close() {
    this.open = false;
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
