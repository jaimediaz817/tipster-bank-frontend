import { Routes } from '@angular/router';
import { AuthShell } from './auth-shell/auth-shell';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthShell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register').then((m) => m.Register),
      },
    ],
  },
];