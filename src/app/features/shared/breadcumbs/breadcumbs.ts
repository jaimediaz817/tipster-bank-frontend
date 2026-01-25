import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Breadcrumb } from '../../../core/models/breadcrumb.model';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (breadcrumbs().length > 0) {
      <nav aria-label="breadcrumb" class="mb-4 text-sm text-slate-500">
        <ol class="flex items-center gap-2">
          <li>
            <a routerLink="/dashboard" class="hover:text-indigo-600 transition-colors">
              <span class="material-icons text-base align-middle">home</span>
            </a>
          </li>
          @for (crumb of breadcrumbs(); track crumb.url; let isLast = $last) {
            <li class="flex items-center gap-2">
              <span class="material-icons text-sm text-slate-400">chevron_right</span>
              @if (!isLast) {
                <a [routerLink]="crumb.url" class="hover:text-indigo-600 transition-colors">
                  {{ crumb.label }}
                </a>
              } @else {
                <span class="font-medium text-slate-700" aria-current="page">
                  {{ crumb.label }}
                </span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
})
export class Breadcrumbs {
  private breadcrumbService = inject(BreadcrumbService);
  breadcrumbs = this.breadcrumbService.breadcrumbs;

  constructor() {
    console.log(">>> ", this.breadcrumbs());
    // Esto inicializa el servicio si aún no ha sido usado.
    this.breadcrumbService;
  }
}