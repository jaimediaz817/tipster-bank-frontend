import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavGroup, NavLink } from '../../models/navigation.model';

@Component({
    selector: 'app-sidebar-menu-ctm',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar-menu-ctm.html',
    styleUrl: './sidebar-menu-ctm.css',
})
export class SidebarMenuCtm {
    @Input({ required: true }) isDesktop!: boolean;
    @Input({ required: true }) sidebarOpen!: boolean;
    @Input({ required: true }) groups: NavGroup[] = [];
    @Input({ required: true }) homeLinkSegments: string[] = [];
    @Input({ required: true }) flyoutGroup: NavGroup | null = null;
    @Input({ required: true }) activeGroupByUrl: NavGroup | null = null;

    @Output() groupClicked = new EventEmitter<{ group: NavGroup; event: MouseEvent }>();
    @Output() logoutClicked = new EventEmitter<void>();
    @Output() linkClicked = new EventEmitter<void>();

    private router = inject(Router);
    subAccordionState: { [key: string]: boolean } = {};

    toggleSubAccordion(key: string) {
        this.subAccordionState[key] = !this.subAccordionState[key];
    }

    isSubAccordionOpen(key: string): boolean {
        return !!this.subAccordionState[key];
    }

    // Genera una clave única para cada subnivel
    getAccordionKey(parentKey: string, link: NavLink): string {
        return parentKey + '>' + link.label;
    }

    isActiveLink(routerLink?: string): boolean {
        if (!routerLink) return false;
        return this.router.isActive(routerLink, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
    }

    hasActiveDescendant(links: NavLink[]): boolean {
        for (const link of links) {
            if (this.isActiveLink(link.routerLink)) return true;
            if (link.links && this.hasActiveDescendant(link.links)) return true;
        }
        return false;
    }    

    onGroupClick(group: NavGroup, event: MouseEvent): void {
        event.stopPropagation();
        this.groupClicked.emit({ group, event });
    }

    onLogoutClick(): void {
        this.logoutClicked.emit();
    }

    /**
     * Maneja el clic en un enlace de navegación.
     */
    onLinkClick(): void {
        this.linkClicked.emit();
    }
}
