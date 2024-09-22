import { Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LayoutComponent } from './layout.component';
import { DeckComponent } from '../deck/deck.component';
import { ListComponent } from '../list/list.component';
import { SetsComponent } from '../sets/sets.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthService],
    children: [
      {
        path: '',
        component: SetsComponent,
        canActivate: [AuthService]
      },
      {
        path: 'deck',
        component: DeckComponent,
        canActivate: [AuthService]
      },
      {
        path: 'deck/set/:setId',
        component: DeckComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthService]
      },
      {
        path: 'list/set/:setId',
        component: ListComponent,
        pathMatch: 'full',
        canActivate: [AuthService]
      }
    ]
  }
];
