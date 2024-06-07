import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, CardComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
