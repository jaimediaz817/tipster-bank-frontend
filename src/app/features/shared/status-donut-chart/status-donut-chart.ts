import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ArcElement, BarController, BarElement, Chart, CategoryScale, ChartConfiguration, ChartType, DoughnutController, Legend, Tooltip, LinearScale } from 'chart.js';
import { StatusSummary } from '../../../core/models/credits-summary.models';

@Component({
  selector: 'app-status-donut-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './status-donut-chart.html',
})
export class StatusDonutChart {


  constructor() {
    // Registramos los componentes necesarios para el gráfico de dona.
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
  }

  @Input() set data(value: StatusSummary[] | null) {
    console.log('[DonutChart] Datos recibidos en @Input:', value); // <-- AÑADE ESTO
    if (!value || value.length === 0) { // <-- MEJORA: Comprueba también si el array está vacío
      this.doughnutChartData = { labels: [], datasets: [] }; // Limpia el gráfico si no hay datos
      return;
    }

    const labels = value.map((s) => this.mapStatusLabel(s.status));
    const counts = value.map((s) => s.count);

    this.doughnutChartData = {
      labels,
      datasets: [
        {
          data: counts,
          // Colores “bancarios”
          backgroundColor: ['#4f46e5', '#16a34a', '#e11d48'],
        },
      ],
    };
  }

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };

  private mapStatusLabel(status: string): string {
    switch (status) {
      case 'EN_REVISION':
        return 'En revisión';
      case 'APROBADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return 'Rechazado';
      default:
        return status;
    }
  }
}
