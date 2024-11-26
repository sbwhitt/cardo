import { Component } from '@angular/core';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor (
    private menuService: MenuService
  ) {}

  ngOnInit() {}

  settingsPressed() {
    this.menuService.openSettings();
  }
}
