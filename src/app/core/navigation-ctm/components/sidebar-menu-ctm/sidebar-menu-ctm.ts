import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavGroup } from '../../models/navigation.model';

@Component({
    selector: 'app-sidebar-menu-ctm',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar-menu-ctm.html',
    styleUrl: './sidebar-menu-ctm.css',
})
export class SidebarMenuCtm {
    @Input({ required: true }) sidebarOpen!: boolean;
    @Input({ required: true }) groups: NavGroup[] = [];
    @Input({ required: true }) homeLinkSegments: string[] = [];
    @Input({ required: true }) flyoutGroup: NavGroup | null = null;
    @Input({ required: true }) activeGroupByUrl: NavGroup | null = null;

    @Output() groupClicked = new EventEmitter<{ group: NavGroup; event: MouseEvent }>();
    @Output() logoutClicked = new EventEmitter<void>();

    onGroupClick(group: NavGroup, event: MouseEvent): void {
        event.stopPropagation();
        this.groupClicked.emit({ group, event });
    }

    onLogoutClick(): void {
        this.logoutClicked.emit();
    }
}
