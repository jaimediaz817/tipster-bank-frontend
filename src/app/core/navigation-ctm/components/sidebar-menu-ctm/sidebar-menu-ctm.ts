import { Component, Input, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { NavigationItem } from '../../models/navigation.model';

@Component({
  selector: 'app-sidebar-menu-ctm',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-menu-ctm.html',
  styleUrls: ['./sidebar-menu-ctm.css'],
})
export class SidebarMenuCtm {
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);

  @Input() autoOpenForActiveRoute = true;

  readonly items = this.navigationService.items;

  // Estado del panel
  readonly panelStack = signal<{ item: NavigationItem }[]>([]);
  readonly activePanel = computed(() => this.panelStack().at(-1));

  // Derivadas seguras para el template
  readonly activeGroups = computed(() => this.activePanel()?.item?.groups ?? []);
  readonly activeTitle = computed(() => this.activePanel()?.item?.label ?? '');
  readonly hasActivePanel = computed(() => this.activeGroups().length > 0);

  // URL activa para resaltar items de grupo
  private readonly activeUrl = signal<string>('');

  constructor() {
    // Sincroniza la URL activa
    this.activeUrl.set(this.router.url);
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.activeUrl.set((e as NavigationEnd).urlAfterRedirects);
    });

    // Auto-abre el item cuyo grupo contiene la ruta actual
    effect(() => {
      if (!this.autoOpenForActiveRoute) return;
      const url = this.activeUrl();
      const matched = this.items().find((item) =>
        (item.groups ?? []).some((g) => g.links.some((l) => url.startsWith(l.routerLink))),
      );
      if (matched && !this.activePanel()) {
        this.openItem(matched);
      }
    });
  }

  isItemActive(item: NavigationItem): boolean {
    const url = this.activeUrl();
    return (item.groups ?? []).some((g) => g.links.some((l) => url.startsWith(l.routerLink)));
  }

  openItem(item: NavigationItem): void {
    this.panelStack.set([{ item }]);
  }

  closePanels(): void {
    this.panelStack.set([]);
  }
}