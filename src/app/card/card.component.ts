import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationEvent } from "@angular/animations";
import { fromEvent, map, zip } from 'rxjs';
import { flip, swipeRight, swipeLeft } from './card.animations';

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
  animations: [flip, swipeRight, swipeLeft]
})
export class CardComponent {
  @Input() front = 'Front';
  @Input() back = 'Back';
  @Input() color = 'lightpink'
  @Input() starred = false;

  @Output() onSwiped = new EventEmitter<boolean>();
  @Output() onStarred = new EventEmitter<void>();

  flipState: AnimState = 'inactive';
  swipeRightState: AnimState = 'inactive';
  swipeLeftState: AnimState = 'inactive';

  flipped = false;
  showInfo = true;

  ngOnInit() {
    // https://github.com/angular/components/issues/24936
    const element = document.getElementById('container');
    if (!element) { return; }
    const touchStart = fromEvent(element, 'touchstart');
    const touchEnd = fromEvent(element, 'touchend');
    zip(touchStart, touchEnd)
        .pipe(
            map(([a, b]) => ({
                start: a as TouchEvent,
                end: b as TouchEvent
            }))
        )
        .subscribe((swipe) => { this.handleSwipe(swipe) });
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

  tap() {
    this.flipState = (this.flipState === 'inactive') ? 'active' : 'inactive';
  }

  starTapped(event: Event) {
    event.stopPropagation();
    this.onStarred.emit();
  }

  swipeRight() {
    this.swipeRightState = (this.swipeRightState === 'inactive') ? 'active' : 'inactive';
  }

  swipeLeft() {
    this.swipeLeftState = (this.swipeLeftState === 'inactive') ? 'active' : 'inactive';
  }

  emitSwiped(event: AnimationEvent) {
    if (event.fromState === 'inactive' && event.toState === 'active') {
      event.triggerName === 'swipeRight' ? this.onSwiped.emit(true) : this.onSwiped.emit(false);
    }
  }
}
