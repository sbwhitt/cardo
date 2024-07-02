import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  query = new FormControl("");

  @Input() search = false;

  @Output() listPressed = new EventEmitter<void>();
  @Output() backPressed = new EventEmitter<void>();
  @Output() settingsPressed = new EventEmitter<void>();
  @Output() undoPressed = new EventEmitter<void>();
  @Output() redoPressed = new EventEmitter<void>();
  @Output() addPressed = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();

  ngOnInit() {
    this.query.valueChanges.subscribe((query) => this.handleSearch(query));
  }

  emitListPressed() {
    this.query.reset();
    this.listPressed.emit();
  }

  handleSearch(query: string | null) {
    if (query === null) { return; }
    this.searchQuery.emit(query);
  }
}
