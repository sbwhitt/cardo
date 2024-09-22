import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private menuService: MenuService,
    public router: Router
  ) {}

  ngOnInit() {}

  settingsPressed() {
    this.menuService.openSettings();
  }
}
