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
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'dashboard',
        canActivate: [
            //   authGuard,
            //   (route, state) => {
            //     const authStore = inject(AuthStore);
            //     const router = inject(Router);
            //     const user = authStore.currentUser();

            //     // Solo aplica cuando la URL es exactamente '/dashboard'
            //     if (state.url === '/dashboard') {
            //       if (user?.roles.includes(UserRole.CLIENTE) && user.roles.length === 1) {
            //         return router.parseUrl('/dashboard/client/home');
            //       }
            //       return router.parseUrl('/dashboard/analyst/home');
            //     }
            //     return true;
            //   },
            authGuard,
            (route, state) => {
                const authStore = inject(AuthStore);
                const router = inject(Router);
                const user = authStore.currentUser();

                if (state.url === '/dashboard') {
                    const roles = user?.roles ?? [];
                    const isAnalyst =
                        roles.includes(UserRole.ANALISTA) || roles.includes(UserRole.ADMIN);
                    const isClient = roles.includes(UserRole.CLIENTE);

                    if (isAnalyst) return router.parseUrl('/dashboard/analyst/home');
                    if (isClient) return router.parseUrl('/dashboard/client/home');

                    return router.parseUrl('/auth/login');
                }
                return true;
            },
        ],
        loadChildren: () =>
            import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    },
    {
        path: '**',
        title: 'No encontrado',
        loadComponent: () =>
            import('./features/shared/pages-tools/not-found-page-ctm/not-found-page-ctm').then(
                (m) => m.NotFoundPageCtm,
            ),
    },
];
