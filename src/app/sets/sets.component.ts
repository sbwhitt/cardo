import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MenuService } from '../services/menu.service';
import { SetsService } from '../services/sets.service';

@Component({
  selector: 'app-sets',
  standalone: true,
  imports: [LoadingComponent, NavbarComponent],
  templateUrl: './sets.component.html',
  styleUrl: './sets.component.scss'
})
export class SetsComponent {
  loading = false;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private setsService: SetsService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.setsService.loadSets().then((sets) => {
      for (let s of sets) {
        console.log('set', s.name);
        s.cards.forEach((c) => console.log('card', c));
      }
      this.loading = false;
    });
  }

  backPressed() {
    this.router.navigateByUrl('');
  }

  addPressed() {
    this.menuService.openAddCard();
  }

}
