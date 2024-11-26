import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';
import { SetSelectComponent } from '../set-select/set-select.component';
import { MenuComponent } from '../menu/menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DeckComponent } from '../deck/deck.component';
import { ListComponent } from '../list/list.component';
import { ActionsService } from '../services/actions.service';
import { LingueeniService } from '../services/lingueeni.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NotificationsComponent,
    SetSelectComponent,
    MenuComponent,
    NavbarComponent,
    DeckComponent,
    ListComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  listOpen = false;
  listExpanded = false;
  query = new Subject<string>();

  constructor(
    private actionsService: ActionsService,
    private lingueeniService: LingueeniService
  ) {}

  ngOnInit() {
    this.lingueeniService.getTranslationFromBase('hello');
  }

  toggleList() {
    this.listOpen = !this.listOpen;
  }

  handleBack() {
    this.listExpanded ?
      this.listExpanded = false :
      this.listOpen = false;
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
