import { Injectable, computed, inject } from '@angular/core';
import { signal } from '@angular/core';
import {
    NavigationItem,
    NavigationGroup,
    NavigationLink,
    NavGroup,
} from '../../navigation-ctm/models/navigation.model';
import { AuthStore } from '../../state/auth.store';
import { UserRole } from '../../models/auth.models';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private authStore = inject(AuthStore);

    private readonly clientGroups: NavGroup[] = [
        {
            id: 'client-credits',
            label: 'Créditos',
            icon: 'account_balance_wallet',
            roles: [UserRole.CLIENTE],
            links: [
                {
                    label: 'Mis Créditos',
                    routerLink: '/dashboard/client/my-credits',
                    icon: 'view_list',
                },
                {
                    label: 'Nueva Solicitud',
                    // routerLink: '/dashboard/client/my-credits/new',
                    icon: 'add_circle',
                    links: [
                        {
                            label: 'Crédito Financiero Hogar',
                            routerLink: '/dashboard/client/my-credits/new',
                            icon: 'home',
                        },
                        {
                            label: 'Crédito Financiero Empresarial',
                            routerLink: '/dashboard/client/my-credits/new/enterprise',
                            icon: 'business',
                        },
                    ],
                },
            ],
        },
        {
            id: 'client-tools',
            label: 'Herramientas',
            icon: 'construction',
            roles: [UserRole.CLIENTE],
            links: [
                {
                    label: 'Simulador de Crédito',
                    routerLink: '/dashboard/tools/simulator',
                    icon: 'calculate',
                    isNew: true,
                },
            ],
        },
    ];

    private readonly analystGroups: NavGroup[] = [
        {
            id: 'analyst-requests',
            label: 'Solicitudes',
            icon: 'folder_shared',
            roles: [UserRole.ANALISTA, UserRole.ADMIN],
            links: [
                {
                    label: 'Bandeja de Tareas',
                    routerLink: '/dashboard/analyst/credits',
                    icon: 'inbox',
                },
            ],
        },
        {
            id: 'analyst-reports',
            label: 'Reportes',
            icon: 'assessment',
            roles: [UserRole.ANALISTA, UserRole.ADMIN],
            links: [
                {
                    label: 'Ver Reportes',
                    routerLink: '/dashboard/reports/list',
                    icon: 'summarize',
                },
                {
                    label: 'Portafolio Detallado',
                    routerLink: '/dashboard/reports/detailed-portfolio',
                    icon: 'analytics',
                    isNew: true,
                },
                {
                    label: 'Exposición por Cliente',
                    routerLink: '/dashboard/reports/client-exposure',
                    icon: 'group',
                    isNew: true,
                },
            ],
        },
    ];

    // --- NUEVO: Computed signal que expone los grupos filtrados por rol ---
    readonly navGroups = computed<NavGroup[]>(() => {
        const user = this.authStore.currentUser();
        if (!user) return [];

        const isAnalyst =
            user.roles.includes(UserRole.ANALISTA) || user.roles.includes(UserRole.ADMIN);
        if (isAnalyst) return this.analystGroups;

        const isClient = user.roles.includes(UserRole.CLIENTE);
        if (isClient) return this.clientGroups;

        return [];
    });
}
