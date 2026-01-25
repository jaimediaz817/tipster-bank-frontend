import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { BarController, BarElement, CategoryScale, Chart, ChartConfiguration, ChartType, Legend, LinearScale, Tooltip } from 'chart.js';
import { StatusSummary } from '../../../core/models/credits-summary.models';

@Component({
  selector: 'app-status-amount-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './status-amount-bar-chart.html',
})
export class StatusAmountBarChart {

  constructor() {
    // CORRECTO: Solo registramos lo que usa este gráfico.
    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  }

  @Input() set data(value: StatusSummary[] | null) {
    if (!value) return;

    const labels = value.map((s) => this.mapStatusLabel(s.status));
    const amounts = value.map((s) => s.totalAmount);

    this.barChartData = {
      labels,
      datasets: [
        {
          data: amounts,
          label: 'Monto total (COP)',
          backgroundColor: '#0f766e',
        },
      ],
    };
  }

  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${Number(value) / 1_000_000}M`,
        },
      },
    },
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
