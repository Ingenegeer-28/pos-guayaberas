// src/app/core/services/export.service.ts

import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Exporta datos a un archivo Excel (.xlsx)
   */
  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Reporte': worksheet }, 
      SheetNames: ['Reporte'] 
    };
    XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  /**
   * Exporta datos a un archivo PDF con formato de tabla
   */
  exportToPdf(columns: string[], data: any[], title: string): void {
    const doc = new jsPDF();
    
    // Título del reporte
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
      startY: 35,
      head: [columns],
      body: data,
      theme: 'striped',
      headStyles: { 
        fillColor: [63, 81, 181], // Color azul (RGB)
        textColor: [255, 255, 255], // Texto blanco
        fontStyle: 'bold' } // Color azul de Material
    });

    doc.save(`${title.replace(' ', '_')}_${new Date().getTime()}.pdf`);
  }
}