import { Router, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/auth.models';
import { DashboardShell } from './features/dashboard/dashboard-shell/dashboard-shell';
import { Component, inject } from '@angular/core';
import { AuthStore } from './core/state/auth.store';


// Componente vacío para satisfacer la configuración de la ruta de redirección.
// Nunca se renderizará porque el guard siempre redirige antes.
@Component({ standalone: true, template: '' })
class EmptyRedirectComponent {}

        export const routes: Routes = [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'auth',
        },
        {
            path: 'auth',
            loadChildren: () =>
            import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
        },
        {
            path: 'dashboard',
            canActivate: [authGuard],
            component: DashboardShell,
            children: [
            {
                path: '',
                pathMatch: 'full',
                // Lógica de carga/redirección inteligente
                canActivate: [() => {
                  const authStore = inject(AuthStore);
                  const router = inject(Router);
                  const user = authStore.currentUser();
                  
                  // Si es cliente, lo mandamos a su lista de créditos.
                  if (user?.roles.includes(UserRole.CLIENTE)) {
                      return router.parseUrl('/dashboard/client/credits');
                  }
                  
                  // Para cualquier otro rol (Analista/Admin), permitimos que la ruta continúe.
                  return true;
                }],
                // Si canActivate devuelve true, se carga este componente.
                loadComponent: () => import('./features/dashboard/dashboard-home-page/dashboard-home-page').then(m => m.DashboardHomePage),
            },
            {
                path: 'client/credits',
                canActivate: [roleGuard],
                data: { roles: [UserRole.CLIENTE] },
                loadComponent: () =>
                import('./features/credits/client-credits-page/client-credits-page').then(
                    (m) => m.ClientCreditsPage,
                ),
            },
            {
                path: 'client/new',
                canActivate: [roleGuard],
                data: { roles: [UserRole.CLIENTE] },
                loadComponent: () =>
                import('./features/credits/new-credit-request-page/new-credit-request-page').then(
                    (m) => m.NewCreditRequestPage,
                ),
            },
            {
                path: 'analyst/credits',
                canActivate: [roleGuard],
                data: { roles: [UserRole.ANALISTA, UserRole.ADMIN] },
                loadComponent: () =>
                import('./features/analyst/analyst-credits-page/analyst-credits-page').then(
                    (m) => m.AnalystCreditsPage,
                ),
            },            
            {
                path: 'analyst/credits',
                canActivate: [roleGuard],
                data: { roles: [UserRole.ANALISTA, UserRole.ADMIN] },
                loadComponent: () =>
                import('./features/analyst/analyst-credits-page/analyst-credits-page').then(
                    (m) => m.AnalystCreditsPage,
                ),
            },

            // Ruta para el simulador, agrupada con las de cliente
            {
                path: 'client/simulador', // URL: /dashboard/client/simulador, TODO: URL: /dashboard/client/simulador
                canActivate: [roleGuard],
                data: { roles: [UserRole.CLIENTE, UserRole.ANALISTA] },
                loadComponent: () =>
                    import('./features/client/credit-simulator-page/credit-simulator-page')
                    .then(m => m.CreditSimulatorPage),
            },

            {
                path: 'reports',
                canActivate: [authGuard, roleGuard],
                data: { roles: [UserRole.ANALISTA] },
                loadChildren: () =>
                    import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
            },            
        
        ],
    },

    {
        path: '**',
        redirectTo: 'auth',
    },
    ];
