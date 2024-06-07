import { Component } from '@angular/core';
import { fromEvent, map, zip } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface Swipe {
  start: TouchEvent;
  end: TouchEvent;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(179deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ]
})
export class CardComponent {
  flipState = 'inactive';

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

  handleTouch() {
    console.log("tap");
    this.flipState = (this.flipState == 'inactive') ? 'active' : 'inactive';
  }

  handleSwipe(touch: Swipe) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events#example
    const diff = touch.end.changedTouches[0].pageX - touch.start.changedTouches[0].pageX;
    if (Math.abs(diff) > 100) {
      diff > 0  ? this.swipeRight() : this.swipeLeft();
    }
  }

  swipeRight() {
    console.log("right");
  }

  swipeLeft() {
    console.log("left");
  }
}
