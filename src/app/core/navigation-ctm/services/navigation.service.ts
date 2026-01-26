import { Injectable, computed, inject } from '@angular/core';
import { signal } from '@angular/core';
import {
    NavigationItem,
    NavigationGroup,
    NavigationLink,
} from '../../navigation-ctm/models/navigation.model';
import { AuthStore } from '../../state/auth.store';
import { UserRole } from '../../models/auth.models';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private authStore = inject(AuthStore);

    // Menú base (sin filtrar). Evita poner lógica aquí; solo definición.
    private readonly baseItems = signal<NavigationItem[]>([
        {
            label: 'Solicitud de productos',
            icon: 'request_quote',
            roles: [UserRole.CLIENTE],
            isMenu: true,
            groups: [
                {
                    title: 'Créditos',
                    links: [
                        {
                            label: 'Mis solicitudes',
                            routerLink: '/dashboard/client/my-credits',
                            icon: 'list',
                            roles: [UserRole.CLIENTE],
                        },
                        {
                            label: 'Nueva solicitud',
                            routerLink: '/dashboard/client/my-credits/new',
                            icon: 'add_circle',
                            roles: [UserRole.CLIENTE],
                        },
                        // Si aún no agregaste la ruta canónica del simulador, cambia por /dashboard/client/simulator
                        {
                            label: 'Simulador de créditos',
                            routerLink: '/dashboard/simulator',
                            icon: 'calculate',
                            roles: [UserRole.CLIENTE, UserRole.ANALISTA, UserRole.ADMIN],
                        },
                    ],
                },
            ],
        },
        {
            label: 'Productos',
            icon: 'account_balance',
            roles: [UserRole.CLIENTE],
            isMenu: true,
            groups: [
                {
                    title: 'Cuentas',
                    links: [
                        {
                            label: 'Tus cuentas',
                            routerLink: '/dashboard/client/accounts',
                            icon: 'account_balance_wallet',
                            roles: [UserRole.CLIENTE],
                        },
                        {
                            label: 'Tu tarjeta',
                            routerLink: '/dashboard/client/card',
                            icon: 'credit_card',
                            roles: [UserRole.CLIENTE],
                        },
                    ],
                },
                {
                    title: 'Inversiones',
                    links: [
                        {
                            label: 'Tus inversiones',
                            routerLink: '/dashboard/client/investments',
                            icon: 'trending_up',
                            roles: [UserRole.CLIENTE],
                        },
                    ],
                },
                {
                    title: 'Tarjetas de crédito',
                    links: [
                        {
                            label: 'Tus tarjetas',
                            routerLink: '/dashboard/client/credit-cards',
                            icon: 'credit_card',
                            roles: [UserRole.CLIENTE],
                        },
                        {
                            label: 'Activar tarjetas',
                            routerLink: '/dashboard/client/credit-cards/activate',
                            icon: 'verified',
                            roles: [UserRole.CLIENTE],
                        },
                        {
                            label: 'Hacer avances',
                            routerLink: '/dashboard/client/credit-cards/cash-advance',
                            icon: 'paid',
                            roles: [UserRole.CLIENTE],
                        },
                    ],
                },
            ],
        },
        {
            label: 'Análisis',
            icon: 'insights',
            roles: [UserRole.ANALISTA, UserRole.ADMIN],
            isMenu: true,
            groups: [
                {
                    title: 'Créditos',
                    links: [
                        {
                            label: 'Gestión de créditos',
                            routerLink: '/dashboard/analyst/credits',
                            icon: 'assignment',
                            roles: [UserRole.ANALISTA, UserRole.ADMIN],
                        },
                    ],
                },
                {
                    title: 'Reportes',
                    links: [
                        {
                            label: 'Listado de reportes',
                            routerLink: '/dashboard/reports/list',
                            icon: 'bar_chart',
                            roles: [UserRole.ANALISTA, UserRole.ADMIN],
                        },
                        {
                            label: 'Cartera detallada',
                            routerLink: '/dashboard/reports/detailed-portfolio',
                            icon: 'analytics',
                            roles: [UserRole.ANALISTA, UserRole.ADMIN],
                        },
                        {
                            label: 'Exposición de clientes',
                            routerLink: '/dashboard/reports/client-exposure',
                            icon: 'pie_chart',
                            roles: [UserRole.ANALISTA, UserRole.ADMIN],
                        },
                    ],
                },
                {
                    title: 'Simulador',
                    links: [
                        {
                            label: 'Simulador de créditos',
                            routerLink: '/dashboard/simulator',
                            icon: 'calculate',
                            roles: [UserRole.ANALISTA, UserRole.ADMIN, UserRole.CLIENTE],
                        },
                    ],
                },
            ],
        },
    ]);

    // Devuelve los items filtrados según roles del usuario
    readonly items = computed<NavigationItem[]>(() => {
        const roles = this.authStore.currentUser()?.roles ?? [];
        return this.baseItems().filter((item) => this.hasAnyRole(roles, item.roles));
    });

    // Ayuda opcional para obtener solo los links visibles (si quieres renderizar un índice)
    groupsFor(item: NavigationItem): NavigationGroup[] {
        if (!item.groups) return [];
        const roles = this.authStore.currentUser()?.roles ?? [];
        return item.groups.map((g) => ({
            title: g.title,
            links: (g.links || []).filter((l) => !l.roles || this.hasAnyRole(roles, l.roles)),
        }));
    }

    private hasAnyRole(userRoles: string[], required: UserRole[] | undefined) {
        if (!required || required.length === 0) return true;
        return required.some((r) => userRoles.includes(r));
    }
}
