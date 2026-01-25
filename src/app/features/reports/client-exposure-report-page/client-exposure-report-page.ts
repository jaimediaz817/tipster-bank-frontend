import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReportsService } from '../../../core/services/reports.service';
import { ClientExposureReport } from '../../../core/models/reports.models';
// import { ExportService } from '../../../core/services/export.service';
import { ToastStore } from '../../../core/state/toast.store';
import { ReportsService } from '../../../core/services/reports';
import { ExportService } from '../../../core/services/export.service';

@Component({
  selector: 'app-client-exposure-report-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-exposure-report-page.html',
})
export class ClientExposureReportPage implements OnInit {
  private reportsService = inject(ReportsService);
  private exportService = inject(ExportService);
  private toastStore = inject(ToastStore);

  // Signals para el estado del componente
  isLoading = signal<boolean>(true);
  reportData = signal<ClientExposureReport[]>([]);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.reportsService.getClientExposureReport().subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.isLoading.set(false);
        if (data.length === 0) {
          this.toastStore.info('No se encontraron datos para este reporte.');
        }
      },
      error: (err) => {
        console.error('Error fetching client exposure report:', err);
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
      'ID Cliente',
      'Nombre Cliente',
      'Email',
      'ID Producto',
      'Producto',
      'Nº Solicitudes',
      'Monto Aprobado Total',
      'Total a Pagar (Simulado)',
      'Cuota Promedio',
    ];

    const body = data.map((row) => [
      row.clientId,
      row.clientFullName,
      row.clientEmail,
      row.productId,
      row.productName,
      row.applicationsCount,
      row.totalApprovedAmount,
      row.simulatedTotalToPay,
      row.averageInstallmentAmount,
    ]);

    this.exportService.exportToExcel(
      body,
      headers,
      'Reporte_Exposicion_Cliente'
    );
    this.toastStore.success('Reporte exportado a Excel con éxito.');
  }

  exportToPdf(): void {
    const data = this.reportData();
    if (data.length === 0) {
      this.toastStore.warning('No hay datos para exportar.');
      return;
    }

    const head = [
      [
        'ID Cliente',
        'Nombre Cliente',
        'Producto',
        'Nº Solicitudes',
        'Monto Aprobado',
        'Total a Pagar',
        'Cuota Promedio',
      ],
    ];

    const body = data.map((row) => [
      row.clientId,
      row.clientFullName,
      row.productName,
      row.applicationsCount,
      this.exportService.formatCurrency(row.totalApprovedAmount),
      this.exportService.formatCurrency(row.simulatedTotalToPay),
      this.exportService.formatCurrency(row.averageInstallmentAmount),
    ]);

    this.exportService.exportToPdf(
      'Reporte de Exposición por Cliente',
      head,
      body,
      'reporte_exposicion_cliente'
    );
    this.toastStore.success('Reporte exportado a PDF con éxito.');
  }
}