import { Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/layout.routes').then(res => res.routes),
    canActivate: [AuthService]
  },
  {
    path: 'auth',
    component: AuthComponent
  }
];
