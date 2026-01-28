import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Breadcrumb } from '../../../core/models/breadcrumb.model';
import { AuthStore } from '../../../core/state/auth.store';
import { UserRole } from '../../../core/models/auth.models';

@Component({
    selector: 'app-breadcrumbs',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        @if (breadcrumbs().length > 0) {
            <nav
                aria-label="breadcrumb"
                class="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white/80 border border-slate-100 rounded-lg px-4 py-2 shadow-sm backdrop-blur-sm mb-4"
            >
                <!-- Enlace a Home -->
                <a
                    [routerLink]="homeUrl()"
                    class="flex items-center gap-1 transition-colors hover:text-indigo-600"
                    aria-label="Inicio"
                >
                    <span class="material-icons text-base align-middle">home</span>
                </a>

                <!-- Itera sobre los breadcrumbs -->
                @for (crumb of breadcrumbs(); track crumb.url; let i = $index; let isLast = $last) {
                    <!-- Separador -->
                    <span class="material-icons text-base text-slate-400 select-none"
                        >chevron_right</span
                    >

                    <!-- Si NO es el último, es un enlace -->
                    @if (!isLast) {
                        <a [routerLink]="crumb.url" class="transition-colors hover:text-indigo-600">
                            {{ crumb.label }}
                        </a>
                    } @else {
                        <!-- Si ES el último, es solo texto -->
                        <span class="font-semibold text-slate-700">{{ crumb.label }}</span>
                    }
                }
            </nav>
        }
    `,
})
export class Breadcrumbs {
    private breadcrumbService = inject(BreadcrumbService);
    private authStore = inject(AuthStore);

    breadcrumbs = this.breadcrumbService.breadcrumbs;

    homeUrl = computed(() => {
        const roles = this.authStore.currentUser()?.roles ?? [];
        const isAnalyst = roles.includes(UserRole.ANALISTA) || roles.includes(UserRole.ADMIN);
        const isClient = roles.includes(UserRole.CLIENTE);

        if (isAnalyst) return '/dashboard/analyst/home';
        if (isClient) return '/dashboard/client/home';
        // Fallback en caso de no tener rol válido
        return '/dashboard';
    });
}
