import { Directive, ElementRef } from '@angular/core';
import { fromEvent, map, zip } from 'rxjs';

@Directive({
  selector: '[touch]',
  standalone: true
})
export class TouchDirective {

  constructor(private el: ElementRef) {
    const element = el.nativeElement;
    const touchStart = fromEvent(element, 'touchstart');
    const touchEnd = fromEvent(element, 'touchend');
    zip(touchStart, touchEnd)
        .pipe(
            map(([a, b]) => ({
                start: a as TouchEvent,
                end: b as TouchEvent
            }))
        )
        .subscribe((swipe) => { el.nativeElement.queueTouch(swipe) });
  }

}
