import { Component } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { MenuComponent } from '../menu/menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DeckComponent } from '../deck/deck.component';
import { ActionsService } from '../services/actions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NotificationsComponent, MenuComponent, NavbarComponent, DeckComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  settingsMenuOpen = false;
  addCardMenuOpen = false;
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

  closeMenu() {
    this.settingsMenuOpen = false;
    this.addCardMenuOpen = false;
  }

  toggleSettingsMenu() {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  toggleAddCardMenu() {
    this.addCardMenuOpen = !this.addCardMenuOpen;
  }

  handleUndo() {
    this.actionsService.applyUndo();
  }

  handleRedo() {
    this.actionsService.applyRedo();
  }
}
