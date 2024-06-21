import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DeckComponent } from '../deck/deck.component';
import { MenuComponent } from '../menu/menu.component';
import { ActionsService } from '../services/actions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MenuComponent, NavbarComponent, DeckComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  menuOpen = false;
  sample = false;

  constructor(
    private actionsService: ActionsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.router.url === '/sample') {
      this.sample = true;
    }
  }

  handleUndo() {
    this.actionsService.applyUndo();
  }

  handleRedo() {
    this.actionsService.applyRedo();
  }
}
