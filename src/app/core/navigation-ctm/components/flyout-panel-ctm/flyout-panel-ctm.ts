import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavGroup } from '../../models/navigation.model';

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

    onClose(): void {
        this.close.emit();
    }
}
