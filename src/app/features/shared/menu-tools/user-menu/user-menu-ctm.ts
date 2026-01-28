import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface UserMenuOption {
    label: string;
    icon?: string;
    action?: () => void;
    routerLink?: string;
    danger?: boolean;
    dividerAbove?: boolean;
}

@Component({
    selector: 'app-user-menu',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './user-menu-ctm.html',
    styleUrls: ['./user-menu-ctm.css'],
})
export class UserMenuCtm {
    @Input() userName = '';
    @Input() userEmail = '';
    @Input() avatarUrl?: string;
    @Input() options: UserMenuOption[] = [];
    @Input() menuOpen = false;
    @Output() menuOpenChange = new EventEmitter<boolean>();

    @Output() logout = new EventEmitter<void>();

    // Cierra el menú al hacer click fuera
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-trigger') && !target.closest('.user-menu-dropdown')) {
            if (this.menuOpen) {
                this.menuOpen = false;
                this.menuOpenChange.emit(false);
            }
        }
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this.menuOpenChange.emit(this.menuOpen);
    }

    onOptionClick(option: UserMenuOption) {
        if (option.action) option.action();
        this.menuOpen = false;
        this.menuOpenChange.emit(false);
    }

    onLogoutClick(): void {
        this.logout.emit(); // Emite un evento para que el componente padre maneje el cierre de sesión
        this.menuOpen = false; // Cierra el menú
        this.menuOpenChange.emit(false);
    }
}
