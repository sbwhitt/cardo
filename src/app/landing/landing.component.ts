import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
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
