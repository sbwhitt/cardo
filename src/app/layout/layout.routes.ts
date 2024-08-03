import { Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LayoutComponent } from './layout.component';
import { LandingComponent } from '../landing/landing.component';
import { DeckComponent } from '../deck/deck.component';
import { ListComponent } from '../list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthService],
    children: [
      {
        path: '',
        component: LandingComponent,
        canActivate: [AuthService]
      },
      {
        path: 'deck',
        component: DeckComponent,
        canActivate: [AuthService]
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthService]
      }
    ]
  }
];
