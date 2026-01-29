import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavGroup, NavLink } from '../../models/navigation.model';

@Component({
    selector: 'app-flyout-panel-ctm',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './flyout-panel-ctm.html',
    styleUrl: './flyout-panel-ctm.css',
})
export class FlyoutPanelCtm {
    @Input({ required: true }) group!: NavGroup;
    @Input({ required: true }) sidebarOpen!: boolean;

    @Output() close = new EventEmitter<void>();
    // Stack de paneles: cada nivel es { title, links }
    panelStack: { title: string; links: NavLink[] }[] = [];  
    private router = inject(Router);

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

    ngOnInit() {
        // Inicializa el stack con el grupo raíz
        this.panelStack = [{ title: this.group.label, links: this.group.links }];
    }

    openPanel(link: NavLink) {
        if (link.links) {
            this.panelStack.push({ title: link.label, links: link.links });
        }
    }

    goBack() {
        if (this.panelStack.length > 1) {
            this.panelStack.pop();
        }
    }

    onClose(): void {
        this.panelStack = [{ title: this.group.label, links: this.group.links }];
        this.close.emit();
    }
}
