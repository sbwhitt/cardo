import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MenuService } from '../services/menu.service';
import { SetsService } from '../services/sets.service';
import { Set } from '../models';
import { SetEditComponent } from "../set-edit/set-edit.component";

@Component({
  selector: 'app-sets',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoadingComponent,
    NavbarComponent,
    SetEditComponent
  ],
  templateUrl: './sets.component.html',
  styleUrl: './sets.component.scss'
})
export class SetsComponent {
  loading = false;

  sets: Set[] = [];
  editing: Set | null = null;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private setsService: SetsService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.setsService.loadSets().then((sets) => {
      this.sets = sets;
      this.loading = false;
    });
  }

  navigate(set: Set) {
    this.router.navigateByUrl('/list/set/' + set.id);
  }

  edit(event: Event, set: Set) {
    event.stopPropagation();
    this.editing = set;
  }

  backPressed() {
    this.router.navigateByUrl('');
  }

  addPressed() {
    this.menuService.openAddSet();
  }

}
