import { animate, state, style, transition, trigger } from "@angular/animations";

export const flip = trigger('flip', [
  state('active', style({
    transform: 'rotateY(180deg)'
  })),
  state('inactive', style({
    transform: 'rotateY(0)'
  })),
  transition('active => inactive', animate('300ms ease-out')),
  transition('inactive => active', animate('300ms ease-in'))
]);

export const swipeRight = trigger('swipeRight', [
  state('active', style({
    transform: 'rotateZ(90deg)',
    translate: '150% -100%'
  })),
  state('inactive', style({
    transform: 'rotateZ(0deg)',
    translate: '0% 0%'
  })),
  transition('active => inactive', animate('300ms ease-out')),
  transition('inactive => active', animate('300ms ease-in'))
]);

export const swipeLeft = trigger('swipeLeft', [
  state('active', style({
    transform: 'rotateZ(-90deg)',
    translate: '-150% -100%'
  })),
  state('inactive', style({
    transform: 'rotateZ(0deg)',
    translate: '0% 0%'
  })),
  transition('active => inactive', animate('400ms ease-out')),
  transition('inactive => active', animate('400ms ease-in'))
]);

export const fadeIn = trigger('fadeIn', [
  state('active', style({
    opacity: '100%'
  })),
  state('inactive', style({
    opacity: '0%'
  })),
  transition('active => inactive', animate('200ms ease-out')),
  transition('inactive => active', animate('200ms ease-in'))
]);
