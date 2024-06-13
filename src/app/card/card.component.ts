import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationEvent } from "@angular/animations";
import { flip, swipeRight, swipeLeft, fadeIn } from './card.animations';
import { Card } from '../models';

interface Swipe {
  start: TouchEvent;
  end: TouchEvent;
}

type AnimState = 'inactive' | 'active';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  animations: [flip, swipeRight, swipeLeft, fadeIn]
})
export class CardComponent {
  @Input() card!: Card;
  @Input() color!: string;
  @Input() englishFirst!: boolean;

  @Output() onSwiped = new EventEmitter<boolean>();
  @Output() onStarred = new EventEmitter<boolean>();

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

  ngOnInit() {}

  @HostListener('window:touchstart', ['$event'])
  handleTouchStart(event: TouchEvent) {
    this.touchStart = event;
  }

  @HostListener('window:touchend', ['$event'])
  handleTouchEnd(event: TouchEvent) {
    if (!this.touchStart) { return; }
    this.handleSwipe({
      start: this.touchStart,
      end: event
    });
    this.touchStart = null;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
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
    return this.englishFirst ? this.card.english : this.card.german;
  }

  getBack(): string {
    return this.englishFirst ? this.card.german : this.card.english;
  }

  tap() {
    if (!this.showCard) { return; }
    this.flipState = (this.flipState === 'inactive') ? 'active' : 'inactive';
  }

  menuClose(event: Event) {
    event.stopPropagation();
    this.fade();
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
    this.onStarred.emit(!this.card.starred);
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
