import { Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LayoutComponent } from './layout/layout.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthService]
  },
  {
    path: 'auth',
    component: AuthComponent
  }
];
