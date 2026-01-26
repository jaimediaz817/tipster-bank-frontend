import { Routes } from '@angular/router';
import { AnalystCreditsPage } from './analyst-credits-page/analyst-credits-page';
import { AnalystShellComponent } from './analyst-shell/analyst-shell.component';
import { DashboardHomePage } from '../dashboard/dashboard-home-page/dashboard-home-page';

export const ANALYST_ROUTES: Routes = [
  {
    path: '',
    component: AnalystShellComponent,
    //data: { breadcrumb: 'Análisis' }, // Nivel 1 de la miga de pan
    children: [
      {
        path: 'home',
        component: DashboardHomePage,
        title: 'Inicio Analista',
        data: { breadcrumb: 'Inicio' },
      },        
      {
        path: 'credits',
        component: AnalystCreditsPage,
        title: 'Gestión de Créditos',
        data: { breadcrumb: 'Créditos' }, // Nivel 2
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];