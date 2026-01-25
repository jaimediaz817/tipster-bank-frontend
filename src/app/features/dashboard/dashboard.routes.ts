import { Routes } from '@angular/router';
import { DashboardShell } from './dashboard-shell/dashboard-shell';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.models';
import { authGuard } from '../../core/guards/auth.guard';
import { DashboardHomePage } from './dashboard-home-page/dashboard-home-page';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardShell,
    canActivate: [authGuard],
    children: [
      // ... tus rutas existentes
      {
        path: 'home',
        component: DashboardHomePage,
        title: 'Dashboard',
        data: { breadcrumb: 'Home' },
      },
      {
        path: 'client',
        loadChildren: () => import('../client/client.routes').then((m) => m.CLIENT_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.CLIENTE],
          breadcrumb: 'Cliente', // Nivel 1 para todas las rutas de cliente
        },
      },     
      {
        path: 'analyst',
        loadChildren: () => import('../analyst/analyst.routes').then((m) => m.ANALYST_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.ANALISTA, UserRole.ADMIN],
          breadcrumb: 'Analista', // ¡Esto es clave!
          // El breadcrumb 'Análisis' ya está en analyst.routes.ts
        },
      },       

      // REPORTES
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.routes').then((m) => m.REPORTS_ROUTES),
        canActivate: [roleGuard],
        data: { 
          roles: [UserRole.ANALISTA],
          breadcrumb: 'Reportes' 
        },
        
      },

      // ... el resto de tus rutas
    ],    
  },
];