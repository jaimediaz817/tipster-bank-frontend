import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../core/state/auth.store';
import { UserRole } from '../../../core/models/auth.models';
import { Breadcrumbs } from '../../shared/breadcumbs/breadcumbs';
import { SidebarMenuCtm } from '../../../core/navigation-ctm/components/sidebar-menu-ctm/sidebar-menu-ctm';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, Breadcrumbs, Breadcrumbs, SidebarMenuCtm],
  templateUrl: './dashboard-shell.html',
  styleUrls: ['./dashboard-shell.css'],
})
export class DashboardShell {

  sidebarOpen = true;
  today = new Date();
  
  private readonly authStore = inject(AuthStore);
  private readonly router    = inject(Router);

  readonly user  = computed(() => this.authStore.currentUser());
  readonly roles = computed<string[]>(() => this.user()?.roles ?? []);

  readonly isClient  = computed(() => this.roles().includes(UserRole.CLIENTE));
  readonly isAnalyst = computed(() =>
    this.roles().includes(UserRole.ANALISTA) || this.roles().includes(UserRole.ADMIN),
  );

  homeLinkSegments(): string[] {
    return this.isAnalyst()
      ? ['analyst', 'home']
      : ['client', 'home'];
  }  

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/auth/login']);
  }

}
