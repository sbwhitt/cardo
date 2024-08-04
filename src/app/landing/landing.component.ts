import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { MenuService } from '../services/menu.service';

interface MenuOption {
  link: string;
  color: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  menuOptions: MenuOption[] = [
    {
      link: 'list',
      color: 'lightgreen'
    },
    {
      link: 'deck',
      color: 'plum'
    },
    {
      link: 'sets',
      color: 'palegoldenrod'
    }
  ];

  constructor(
    private authService: AuthService,
    private menuService: MenuService
  ) {}

  logout() {
    this.authService.signOut();
    window.location.reload();
  }

  addPressed() {
    this.menuService.openAddCard();
  }
}
