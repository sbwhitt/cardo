import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DeckComponent } from '../deck/deck.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, DeckComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
