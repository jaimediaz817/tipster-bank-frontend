import { Router, Routes } from '@angular/router';
import { DashboardShell } from './dashboard-shell/dashboard-shell';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.models';
import { AuthStore } from '../../core/state/auth.store';
import { inject } from '@angular/core';
import { CreditSimulatorPage } from '../client/credit-simulator-page/credit-simulator-page';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardShell,
    children: [
      {
        path: 'tools/simulator',
        component: CreditSimulatorPage,
        canActivate: [roleGuard],
        data: { roles: [UserRole.CLIENTE, UserRole.ANALISTA, UserRole.ADMIN], breadcrumb: 'Simulador' },
      },      
      {
        path: 'client',
        loadChildren: () => import('../client/client.routes').then((m) => m.CLIENT_ROUTES),
        canActivate: [roleGuard],
        // data: { roles: [UserRole.CLIENTE], breadcrumb: 'Cliente' },
      },
      {
        path: 'analyst',
        loadChildren: () => import('../analyst/analyst.routes').then((m) => m.ANALYST_ROUTES),
        canActivate: [roleGuard],
        // data: { roles: [UserRole.ANALISTA, UserRole.ADMIN], breadcrumb: 'Analista' },
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.routes').then((m) => m.REPORTS_ROUTES),
        canActivate: [roleGuard],
        // data: { roles: [UserRole.ANALISTA, UserRole.ADMIN], breadcrumb: 'Reportes' },
      },
    ],
  },
];