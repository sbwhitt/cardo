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
    this.setsService.loadSets()
      .then((sets) => {
        this.sets = sets;
      });
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
