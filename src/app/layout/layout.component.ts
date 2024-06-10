import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DeckComponent } from '../deck/deck.component';
import { MenuComponent } from '../menu/menu.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MenuComponent, NavbarComponent, DeckComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  menuOpen = false;
  actions$ = new Observable()

  handleUndo() {}

  handleRedo() {}
}
