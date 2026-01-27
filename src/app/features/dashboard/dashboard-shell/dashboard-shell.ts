import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../core/state/auth.store';
import { UserRole } from '../../../core/models/auth.models';
import { Breadcrumbs } from '../../shared/breadcumbs/breadcumbs';
import { NavGroup } from '../../../core/navigation-ctm/models/navigation.model';
import { filter } from 'rxjs';
import { NavigationService } from '../../../core/navigation-ctm/services/navigation.service';
import { SidebarMenuCtm } from '../../../core/navigation-ctm/components/sidebar-menu-ctm/sidebar-menu-ctm';
import { FlyoutPanelCtm } from '../../../core/navigation-ctm/components/flyout-panel-ctm/flyout-panel-ctm';

@Component({
    selector: 'app-dashboard-shell',
    standalone: true,
    imports: [CommonModule, RouterOutlet, Breadcrumbs, SidebarMenuCtm, FlyoutPanelCtm],
    templateUrl: './dashboard-shell.html',
    styleUrls: ['./dashboard-shell.css'],
})
export class DashboardShell {
    private readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);
    private readonly navigationService = inject(NavigationService);

    sidebarOpen = signal(true);
    // Signal reactivo para saber si es desktop (md: 768px+)
    isDesktop = signal(window.matchMedia('(min-width: 768px)').matches);
    // ÚNICA SEÑAL para controlar el flyout. Eliminamos flyoutOpen y activeGroup.
    flyoutGroup = signal<NavGroup | null>(null);
    today = new Date();

    readonly user = computed(() => this.authStore.currentUser());
    readonly roles = computed<string[]>(() => this.user()?.roles ?? []);
    readonly isClient = computed(() => this.roles().includes(UserRole.CLIENTE));
    readonly isAnalyst = computed(
        () => this.roles().includes(UserRole.ANALISTA) || this.roles().includes(UserRole.ADMIN),
    );
    currentUrl = signal<string>('');

    // --- AHORA CONSUMIMOS EL SERVICIO ---
    readonly groups = this.navigationService.navGroups;

    constructor() {
        this.currentUrl.set(this.router.url);

        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.currentUrl.set(e.urlAfterRedirects);
                // En móvil, cierra el sidebar después de navegar
                if (!this.isDesktop()) {
                    this.sidebarOpen.set(false);
                    this.flyoutGroup.set(null);
                }
            });

        // Listener para actualizar el signal al cambiar el tamaño de pantalla
        window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
            this.isDesktop.set(e.matches);
        });

        // EFECTO: Limpia el estado si cambiamos entre móvil/desktop
        effect(() => {
            // Llama a isDesktop() para que el efecto se suscriba a sus cambios
            this.isDesktop();
            // Limpia el grupo activo para evitar que el flyout/acordeón se quede abierto
            this.flyoutGroup.set(null);
        });
    }

    closeFlyout() {
        this.flyoutGroup.set(null);
    }

    toggleSidebar() {
        this.sidebarOpen.set(!this.sidebarOpen());
        // Si el usuario cierra el sidebar, también cerramos el flyout/acordeón
        if (!this.sidebarOpen()) {
            this.flyoutGroup.set(null);
        }
    }

    openGroup(data: { group: NavGroup; event: MouseEvent }) {
        data.event.stopPropagation();
        // Si el grupo clicado ya es el activo, lo cerramos (toggle). Si no, lo abrimos.
        this.flyoutGroup.set(this.flyoutGroup() === data.group ? null : data.group);
    }

    // NUEVO: Computed signal para encontrar el grupo activo basado en la URL
    readonly activeGroupByUrl = computed<NavGroup | null>(() => {
        const url = this.currentUrl();
        if (!url) return null;

        const allGroups = this.groups();
        const allLinks = allGroups
            .flatMap((group) => group.links.map((link) => ({ ...link, group })))
            .sort((a, b) => b.routerLink.length - a.routerLink.length);

        for (const link of allLinks) {
            if (url.startsWith(link.routerLink)) {
                return link.group;
            }
        }

        return null;
    });

    // AÑADE ESTE MÉTODO PARA SOLUCIONAR EL ERROR
    onLinkClick(): void {
        // En móvil, al hacer clic en un enlace, cerramos el sidebar.
        if (!this.isDesktop()) {
            this.sidebarOpen.set(false);
            this.flyoutGroup.set(null);
        }
    }    

    homeLinkSegments(): string[] {
        return this.isAnalyst() ? ['/dashboard/analyst/home'] : ['/dashboard/client/home'];
    }

    logout(): void {
        this.authStore.logout();
        this.router.navigate(['/auth/login']);
    }
}
