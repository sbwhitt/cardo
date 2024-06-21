import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationEvent } from "@angular/animations";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardsService } from '../services/cards.service';
import { flip, swipeRight, swipeLeft, fadeIn } from './card.animations';
import { Card } from '../models';
import { TypeColorPipe } from '../pipes/type-color.pipe';

interface Swipe {
  start: TouchEvent;
  end: TouchEvent;
}

type AnimState = 'inactive' | 'active';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TypeColorPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  animations: [flip, swipeRight, swipeLeft, fadeIn]
})
export class CardComponent {
  @Input() card!: Card;
  @Input() color!: string;
  @Input() baseFirst!: boolean;

  @Output() onSwiped = new EventEmitter<boolean>();
  @Output() onUpdated = new EventEmitter<Card>();

  editForm!: FormGroup;

  touchStart: TouchEvent | null = null;

  flipState: AnimState = 'inactive';
  swipeRightState: AnimState = 'inactive';
  swipeLeftState: AnimState = 'inactive';
  fadeInState: AnimState = 'inactive';

  flipped = false;
  flipping = false;

  showEdit = false;
  showCard = true;
  showInfo = false;

  typeOptions!: string[];

  constructor(
    private cardService: CardsService
  ) {}

  ngOnInit() {
    this.typeOptions = this.cardService.typeOptions;
    this.editForm = new FormGroup({
      base: new FormControl(this.card.base, Validators.required),
      goal: new FormControl(this.card.goal, Validators.required),
      type: new FormControl(this.card.type, Validators.required),
      goal_sent_1: new FormControl(this.card.goal_sent_1),
      base_sent_1: new FormControl(this.card.base_sent_1),
      goal_sent_2: new FormControl(this.card.goal_sent_2),
      base_sent_2: new FormControl(this.card.base_sent_2)
    });
  }

  @HostListener('window:touchstart', ['$event'])
  handleTouchStart(event: TouchEvent) {
    this.touchStart = event;
  }

  @HostListener('window:touchend', ['$event'])
  handleTouchEnd(event: TouchEvent) {
    if (!this.touchStart) { return; }
    if (this.showCard) {
      this.handleSwipe({
        start: this.touchStart,
        end: event
      });
    }
    this.touchStart = null;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.showCard) { return; }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      this.tap();
    }
    else if (event.key === "ArrowRight") {
      this.swipeRight();
    }
    else if (event.key === "ArrowLeft") {
      this.swipeLeft();
    }
  }

  handleTouch() {
    this.tap();
  }

  handleSwipe(touch: Swipe) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events#example
    const diff = touch.end.changedTouches[0].pageX - touch.start.changedTouches[0].pageX;
    if (Math.abs(diff) > 100) {
      diff > 0  ? this.swipeRight() : this.swipeLeft();
    }
  }

  getFront(): string {
    return this.baseFirst ? this.card.base : this.card.goal;
  }

  getBack(): string {
    return this.baseFirst ? this.card.goal : this.card.base;
  }

  tap() {
    if (!this.showCard) { return; }
    this.flipState = (this.flipState === 'inactive') ? 'active' : 'inactive';
  }

  menuClose(event: Event) {
    event.stopPropagation();
    this.fade();
  }

  saveEdit(event: Event) {
    this.onUpdated.emit({
      ...this.card,
      ...this.editForm.value
    });
    this.menuClose(event);
  }

  revealCard() {
    this.showEdit = false;
    this.showCard = true;
    this.showInfo = false;
  }

  editTapped(event: Event) {
    event.stopPropagation();
    this.fade();
    this.showEdit = true;
    this.showCard = false;
    this.showInfo = false;
  }

  starTapped(event: Event) {
    event.stopPropagation();
    this.onUpdated.emit({
      ...this.card,
      starred: !this.card.starred
    });
  }

  infoTapped(event: Event) {
    event.stopPropagation();
    this.fade();
    this.showEdit = false;
    this.showCard = false;
    this.showInfo = true;
  }

  swipeRight() {
    this.swipeRightState = (this.swipeRightState === 'inactive') ? 'active' : 'inactive';
  }

  swipeLeft() {
    this.swipeLeftState = (this.swipeLeftState === 'inactive') ? 'active' : 'inactive';
  }

  fade() {
    this.fadeInState = (this.fadeInState === 'inactive') ? 'active' : 'inactive';
  }

  emitSwiped(event: AnimationEvent) {
    if (event.fromState === 'inactive' && event.toState === 'active') {
      event.triggerName === 'swipeRight' ? this.onSwiped.emit(true) : this.onSwiped.emit(false);
    }
  }
}
