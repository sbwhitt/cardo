import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';
import { MenuComponent } from '../menu/menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DeckComponent } from '../deck/deck.component';
import { ListComponent } from '../list/list.component';
import { ActionsService } from '../services/actions.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NotificationsComponent, MenuComponent, NavbarComponent, DeckComponent, ListComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  listOpen = false;
  settingsMenuOpen = false;
  addCardMenuOpen = false;
  sample = false;
  query = new Subject<string>();

  constructor(
    private actionsService: ActionsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.router.url === '/sample') {
      this.sample = true;
    }
  }

  toggleList() {
    this.listOpen = !this.listOpen;
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

  handleSearch(query: string) {
    this.query.next(query);
  }
}
