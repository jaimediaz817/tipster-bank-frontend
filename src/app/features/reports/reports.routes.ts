// filepath: src/app/features/reports/reports.routes.ts
import { Routes } from '@angular/router';
import { ReportsListPage } from './reports-list-page/reports-list-page';
import { DetailedPortfolioReportPage } from './detailed-portfolio-report-page/detailed-portfolio-report-page';
import { ClientExposureReportPage } from './client-exposure-report-page/client-exposure-report-page';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: ReportsListPage,
    title: 'Selección de Reportes',
    // Añadimos data para la miga de pan
    data: {
      breadcrumb: 'Reportes',
    },
    children: [
      {
        path: '',
        component: ReportsListPage,
        data: { breadcrumb: null }, // No repite "Reportes" aquí
      },
      {
        path: 'detailed-portfolio',
        component: DetailedPortfolioReportPage,
        title: 'Reporte Detallado de Cartera',
        data: { breadcrumb: 'Reporte Detallado de Cartera' },
      },
      {
        path: 'client-exposure',
        component: ClientExposureReportPage,
        title: 'Reporte de Exposición por Cliente',
        data: { breadcrumb: 'Reporte de Exposición por Cliente' },
      },
    ],    
  },

  // {
  //   path: 'detailed-portfolio',
  //   component: DetailedPortfolioReportPage,
  //   title: 'Reporte Detallado de Cartera',
  //   data: {
  //     breadcrumb: 'Reporte Detallado de Cartera', // Texto para la miga de pan
  //   },    
  // },
  // {
  //   path: 'client-exposure',
  //   component: ClientExposureReportPage,
  //   title: 'Reporte de Exposición por Cliente',
  //   data: {
  //     breadcrumb: 'Reporte de Exposición por Cliente', // Texto para la miga de pan
  //   },    
  // },
];