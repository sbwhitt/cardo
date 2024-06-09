import { animate, state, style, transition, trigger } from "@angular/animations";

export const drop = trigger('drop', [
  state('active', style({
    top: '0'
  })),
  state('inactive', style({
    top: '-100%'
  })),
  transition('active => inactive', animate('200ms ease-out')),
  transition('inactive => active', animate('200ms ease-in'))
]);
