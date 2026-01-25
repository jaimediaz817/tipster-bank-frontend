import { Routes } from '@angular/router';
import { ClientShellComponent } from './client-shell/client-shell.component';
import { ClientCreditsPage } from '../credits/client-credits-page/client-credits-page';
import { NewCreditRequestPage } from '../credits/new-credit-request-page/new-credit-request-page';
import { CreditSimulatorPage } from './credit-simulator-page/credit-simulator-page';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientShellComponent,
    children: [
      {
        path: 'my-credits',
        component: ClientCreditsPage,
        title: 'Mis Créditos',
        data: { breadcrumb: 'Mis Créditos' },
      },
      {
        path: 'my-credits/new',
        component: NewCreditRequestPage,
        title: 'Nueva Solicitud de Crédito',
        data: { breadcrumb: 'Nueva Solicitud' },
      },
      {
        path: 'simulator',
        component: CreditSimulatorPage,
        title: 'Simulador de Crédito',
        data: { breadcrumb: 'Simulador' },
      },
      {
        path: '',
        redirectTo: 'my-credits',
        pathMatch: 'full',
      },
    ],
  },
];