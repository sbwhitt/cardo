import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() settingsPressed = new EventEmitter<void>();
  @Output() undoPressed = new EventEmitter<void>();
  @Output() redoPressed = new EventEmitter<void>();
  @Output() addPressed = new EventEmitter<void>();
}
