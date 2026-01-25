import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
// CAMBIO 1: Importa la función 'applyPlugin'
import autoTable, { UserOptions } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  /**
   * Exporta datos a un archivo de Excel (.xlsx).
   * @param data - Un array de arrays con los datos de las filas.
   * @param headers - Un array de strings con los nombres de las columnas.
   * @param fileName - El nombre del archivo (sin la extensión).
   */
  exportToExcel(data: any[][], headers: string[], fileName: string): void {
    // ... existing code ...
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  /**
   * Exporta datos a un archivo PDF.
   * @param title - El título que aparecerá en el documento.
   * @param head - Las cabeceras de la tabla (formato para jspdf-autotable).
   * @param body - El cuerpo de la tabla (formato para jspdf-autotable).
   * @param fileName - El nombre del archivo (sin la extensión).
   */
  exportToPdf(reportTitle: string, head: any[][], body: any[][], fileName: string): void {
    const doc = new jsPDF();
    const pageMargin = 14; // Margen izquierdo de la página

    autoTable(doc, {
      head: head,
      body: body,
      startY: 38, // Dejamos más espacio para el nuevo header
      didDrawPage: (data) => {
        // --- INICIO DEL HEADER PERSONALIZADO ---

        // 1. Título del Banco (TipsterBank)
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5'); // Indigo-600
        doc.text('Tipster', pageMargin, 20);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#64748B'); // Slate-500
        
        // LA LÍNEA CORREGIDA: Añadimos "+ 1.5" para dar un respiro
        doc.text('Bank', pageMargin + doc.getTextWidth('Tipster') + 1.85, 20);

        // 2. Título del reporte específico
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#334155'); // Slate-700
        doc.text(reportTitle, pageMargin, 30);

        // 3. Línea decorativa
        doc.setDrawColor('#E2E8F0'); // Slate-200
        doc.line(pageMargin, 32, doc.internal.pageSize.width - pageMargin, 32);

        // --- FIN DEL HEADER PERSONALIZADO ---
      },
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      margin: { top: 38 } // Aseguramos que la tabla empiece debajo del header
    });

    doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  /**
   * Helper para formatear números como moneda en los PDFs.
   * @param value - El valor numérico.
   * @returns El string formateado (ej: $1,234,567).
   */
  formatCurrency(value: number): string {
    // ... existing code ...
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}