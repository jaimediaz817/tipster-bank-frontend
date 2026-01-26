import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { StatusDonutChart } from '../../shared/status-donut-chart/status-donut-chart';
import { StatusAmountBarChart } from '../../shared/status-amount-bar-chart/status-amount-bar-chart';
import { CreditsService } from '../../../core/services/credits.service';
import { CreditsSummary } from '../../../core/models/credits-summary.models';
import { AuthStore } from '../../../core/state/auth.store';
import { UserRole } from '../../../core/models/auth.models';

@Component({
  selector: 'app-dashboard-home-page',
  standalone: true,
  // Importamos los componentes de los gráficos
  imports: [CommonModule, StatusDonutChart, StatusAmountBarChart],
  // Usamos el nuevo archivo HTML
  templateUrl: './dashboard-home-page.html',
})
export class DashboardHomePage implements OnInit {

  private creditsService = inject(CreditsService);
  private authStore = inject(AuthStore);

  // Signals para manejar el estado de la carga y los datos
  isLoading = signal(true);
  summary = signal<CreditsSummary | null>(null);

  ngOnInit(): void {
    const user = this.authStore.currentUser();
    const roles = user?.roles ?? [];
    const isAnalyst = roles.includes(UserRole.ANALISTA) || roles.includes(UserRole.ADMIN);

    if (isAnalyst) {
      this.loadSummary();
    } else {
      this.isLoading.set(false);
      this.summary.set(null);
    }
  }

    getStatusCount(status: string): number {
        const summary = this.summary();
        if (!summary || !summary.byStatus) return 0;
        const found = summary.byStatus.find(s => s.status === status);
        return found?.count ?? 0;
    }

  private loadSummary(): void {
    this.isLoading.set(true);
    this.creditsService.getChartSummaryForAnalyst().subscribe({
      next: (res) => {
        console.log('[DashboardHome] Resumen cargado', res);
        this.summary.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[DashboardHome] Error cargando resumen', err);
        this.isLoading.set(false);
        // Aquí podrías establecer un mensaje de error si lo necesitaras
      },
    });
  }
}
