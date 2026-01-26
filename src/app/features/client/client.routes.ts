import { Routes } from '@angular/router';
import { ClientShellComponent } from './client-shell/client-shell.component';
import { ClientCreditsPage } from '../credits/client-credits-page/client-credits-page';
import { NewCreditRequestPage } from '../credits/new-credit-request-page/new-credit-request-page';
import { CreditSimulatorPage } from './credit-simulator-page/credit-simulator-page';
import { ClientDashboardHomePage } from './pages/dashboard-home-page/client-dashboard-home-page';


// NOTE: Así, /dashboard/client/home será la nueva home del cliente.
export const CLIENT_ROUTES: Routes = [
    {
        path: '',
        component: ClientShellComponent,
        data: { breadcrumb: 'Clientes' },
        children: [
            {
                path: 'home',
                component: ClientDashboardHomePage, // importa el componente creado
                title: 'Inicio',
                data: { breadcrumb: 'Inicio' },
            },        
            {
                path: 'my-credits',
                component: ClientCreditsPage,
                title: 'Mis Créditos',
                data: { breadcrumb: 'Mis solicitudes' },
            },
            {
                path: 'my-credits/new',
                component: NewCreditRequestPage,
                title: 'Nueva Solicitud de Crédito',
                data: { breadcrumb: 'Nueva Solicitud' },
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
        ],
    },
];