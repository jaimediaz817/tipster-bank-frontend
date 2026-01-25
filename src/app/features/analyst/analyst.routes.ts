import { Routes } from '@angular/router';
import { AnalystCreditsPage } from './analyst-credits-page/analyst-credits-page';
import { AnalystShellComponent } from './analyst-shell/analyst-shell.component';

export const ANALYST_ROUTES: Routes = [
  {
    path: '',
    component: AnalystShellComponent,
    //data: { breadcrumb: 'Análisis' }, // Nivel 1 de la miga de pan
    children: [
      {
        path: 'credits',
        component: AnalystCreditsPage,
        title: 'Gestión de Créditos',
        data: { breadcrumb: 'Créditos' }, // Nivel 2
      },
      {
        path: '',
        redirectTo: 'credits',
        pathMatch: 'full',
      },
    ],
  },
];