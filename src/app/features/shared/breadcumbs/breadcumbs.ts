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
      <nav aria-label="breadcrumb" class="mb-4 text-sm text-slate-500">
        <ol class="flex items-center gap-2">
          <li>
            <a [routerLink]="homeUrl()" class="hover:text-indigo-600 transition-colors" aria-label="Inicio">
              <span class="material-icons text-base align-middle">home</span>
            </a>
          </li>
          @for (crumb of breadcrumbs(); track crumb.url) {
            <li class="flex items-center gap-2">
              <span class="material-icons text-sm text-slate-400">chevron_right</span>
              <a [routerLink]="crumb.url" class="hover:text-indigo-600 transition-colors">
                {{ crumb.label }}
              </a>
            </li>
          }
        </ol>
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