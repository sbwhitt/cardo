import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-color-choice',
  standalone: true,
  imports: [],
  templateUrl: './color-choice.component.html',
  styleUrl: './color-choice.component.scss'
})
export class ColorChoiceComponent {

  @Input() value!: string;
  @Input() selected = false;

}
