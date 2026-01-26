// filepath: src/app/features/reports/reports.routes.ts
import { Routes } from '@angular/router';
import { ReportsListPage } from './reports-list-page/reports-list-page';
import { DetailedPortfolioReportPage } from './detailed-portfolio-report-page/detailed-portfolio-report-page';
import { ClientExposureReportPage } from './client-exposure-report-page/client-exposure-report-page';
import { ReportsShellComponent } from './reports-shell/reports-shell.component';

export const REPORTS_ROUTES: Routes = [
  {
  //   path: '',
  //   component: ReportsShellComponent, // <--- CAMBIO 1: Usar el shell como componente principal
  //   data: {
  //     breadcrumb: 'Reportes', // El breadcrumb se queda en la ruta padre
  //   },    
  //   children: [
  //     {
  //       path: '', // La ruta vacía ahora carga la lista de reportes
  //       component: ReportsListPage,
  //       // title: 'Selección de Reportes',
  //       data: { breadcrumb: 'Reportes' },
  //     },
  //     {
  //       path: 'detailed-portfolio',
  //       component: DetailedPortfolioReportPage,
  //       title: 'Reporte Detallado de Cartera',
  //       data: { breadcrumb: 'Reporte Detallado de Cartera' },
  //     },
  //     {
  //       path: 'client-exposure',
  //       component: ClientExposureReportPage,
  //       title: 'Reporte de Exposición por Cliente',
  //       data: { breadcrumb: 'Reporte de Exposición por Cliente' },
  //     },
  //   ],    
  // },

    path: '',
    component: ReportsShellComponent,
    data: { breadcrumb: 'Reportes' },
    children: [
      {
        path: 'list',
        component: ReportsListPage,
        title: 'Listado de reportes',
        data: { breadcrumb: 'Listado' },
      },
      {
        path: 'detailed-portfolio',
        component: DetailedPortfolioReportPage,
        title: 'Cartera detallada',
        data: { breadcrumb: 'Cartera detallada' },
      },
      {
        path: 'client-exposure',
        component: ClientExposureReportPage,
        title: 'Exposición de clientes',
        data: { breadcrumb: 'Exposición de clientes' },
      },
      { path: '', pathMatch: 'full', redirectTo: 'list' },
    ],
  },  
];