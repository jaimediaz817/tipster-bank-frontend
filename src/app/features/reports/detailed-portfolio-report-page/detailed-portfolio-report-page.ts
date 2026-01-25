import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReportsService } from '../../../core/services/reports.service';
import { DetailedPortfolioReport } from '../../../core/models/reports.models';
import { ExportService } from '../../../core/services/export.service'; // <--- Lo usamos aquí también
import { ToastStore } from '../../../core/state/toast.store';
import { ReportsService } from '../../../core/services/reports';

@Component({
  selector: 'app-detailed-portfolio-report-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detailed-portfolio-report-page.html',
})
export class DetailedPortfolioReportPage implements OnInit {
  private reportsService = inject(ReportsService);
  private exportService = inject(ExportService); // <--- Inyectado
  private toastStore = inject(ToastStore); // <--- Inyectado

  isLoading = signal<boolean>(true);
  reportData = signal<DetailedPortfolioReport[]>([]);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.reportsService.getDetailedPortfolioReport().subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.isLoading.set(false);
        if (data.length === 0) {
          this.toastStore.info('No se encontraron datos para este reporte.');
        }
      },
      error: (err) => {
        console.error('Error fetching detailed portfolio report:', err);
        this.errorMessage.set(
          'No se pudo cargar el reporte. Por favor, inténtalo de nuevo más tarde.'
        );
        this.isLoading.set(false);
        this.toastStore.error(this.errorMessage()!);
      },
    });
  }

  exportToExcel(): void {
    const data = this.reportData();
    if (data.length === 0) {
      this.toastStore.warning('No hay datos para exportar.');
      return;
    }

    const headers = [
      'ID Solicitud', 'ID Cliente', 'Nombre Cliente', 'Email', 'Producto',
      'Moneda', 'Monto', 'Plazo (Meses)', 'Estado', 'Fecha Creación',
      'Fuente Ingresos', 'Comentarios Analista'
    ];

    const body = data.map(row => [
      row.applicationId, row.clientId, row.clientFullName, row.clientEmail, row.productName,
      row.currencyCode, row.amount, row.termMonths, row.status,
      new Date(row.createdAt).toLocaleDateString(),
      row.incomeSource, row.analystComments ?? 'N/A'
    ]);

    this.exportService.exportToExcel(body, headers, 'Reporte_Detallado_Cartera');
    this.toastStore.success('Reporte exportado a Excel con éxito.');
  }

  exportToPdf(): void {
    const data = this.reportData();
    if (data.length === 0) {
      this.toastStore.warning('No hay datos para exportar.');
      return;
    }

    const head = [['ID', 'Cliente', 'Producto', 'Monto', 'Plazo', 'Estado']];

    const body = data.map(row => [
      row.applicationId,
      row.clientFullName,
      row.productName,
      this.exportService.formatCurrency(row.amount),
      `${row.termMonths} meses`,
      row.status
    ]);

    this.exportService.exportToPdf(
      'Reporte Detallado de Cartera', // Título del reporte
      head,
      body,
      'reporte_detallado_cartera' // Nombre del archivo
    );
    this.toastStore.success('Reporte exportado a PDF con éxito.');
  }
}