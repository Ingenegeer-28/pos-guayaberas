// src/app/modules/sales/pages/sales-history/sales-history.component.ts

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SaleService } from 'src/app/core/services/sale.service';
import { PrintService } from 'src/app/core/services/print.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SaleDetailDialogComponent } from '../../components/sale-detail-dialog/sale-detail-dialog.component';
import { SaleItemRequest, SaleRequest } from 'src/app/core/models/sale.model';
import { ExportService } from 'src/app/core/services/export.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.css']
})
export class SalesHistoryComponent implements OnInit {

  @ViewChild('salesChart') salesChartCanvas!: ElementRef;
  chart: any;

  filterFolio: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  sales: any[] = [];
  // displayedColumns: string[] = ['id', 'fecha', 'vendedor', 'metodo', 'total', 'estatus', 'acciones'];

  // Fuente de datos mejorada
  dataSource = new MatTableDataSource<any>([]);
  // displayedColumns: string[] = ['id', 'fecha', 'vendedor', 'metodo', 'total', 'estatus', 'acciones'];
  
  columnasEscritorio = ['id', 'fecha', 'vendedor', 'metodo', 'total', 'estatus', 'acciones'];
  columnasMovil = ['id', 'total', 'acciones']; // Solo lo vital
  displayedColumns: string[] = this.columnasEscritorio;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private saleService: SaleService,
    private exportService: ExportService,
    private printService: PrintService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.displayedColumns = result.matches 
          ? this.columnasMovil 
          : this.columnasEscritorio;
      });

    this.loadSales();
  }

  loadSales() {
    const filters = {
      id_venta: this.filterFolio,
      inicio: this.startDate ? formatDate(this.startDate, 'yyyy-MM-dd', 'en-US') : '',
      fin: this.endDate ? formatDate(this.endDate, 'yyyy-MM-dd', 'en-US') : ''
    };

    this.saleService.getSales(filters).subscribe(res => {
      if (res.success){ 
        this.sales = res.data;
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.updateChart();
      }
    });
  }

  filterToday() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.loadSales();
  }
  reprintTicket(sale: any) {
    // Adaptamos el objeto de la DB al formato que espera el PrintService
    this.saleService.getSaleById(sale.id_venta).subscribe(res => {
      console.log(res);

      if(res.success){
        var producs : SaleItemRequest[] =[];

        res.data.productos.forEach(prodcut => {
          const saleItem: SaleItemRequest ={
            id_producto: prodcut.id_producto.toString(),
            cantidad: prodcut.cantidad,
            precio: parseFloat(prodcut.precio_unitario),
          }
          producs.push(saleItem);
        });

        const saleData : any = {
        subtotal: parseFloat(res.data.subtotal),
        descuento_global: parseFloat(res.data.descuento_global),
        impuestos: parseFloat(res.data.impuestos),
        envio: parseFloat(res.data.envio),
        total_final: parseFloat(res.data.total_final),
        metodo_pago: res.data.metodo_pago,
        id_usuario: res.data.id_usuario,
        items: producs // Nota: En un sistema real, haríamos un GET previo para obtener los items
    };
    
    // Si quieres los items exactos, tendrías que llamar a la API por ID primero
    this.printService.printTicket(saleData as any, sale.id_venta);
      }
      
    });
    
  }

  /**
   * Abre el modal y busca los items de la venta
   */
  viewDetail(sale: any) {
    // Llamamos a la API para obtener los productos de esta venta específica
    this.saleService.getSaleById(sale.id_venta).subscribe(res => {
      console.log(res);
      this.dialog.open(SaleDetailDialogComponent, {
        width: '600px',
        data: res.data
      });
    });
  }
  /**
   * Calcula el total de lo que se está mostrando actualmente 
   * (útil si hay filtros aplicados)
   */
  getTotalVendido(): number {
    return this.dataSource.filteredData
      .filter(sale => sale.estatus_venta !== 'cancelada')
      .reduce((acc, sale) => acc + parseFloat(sale.total_final), 0);
  }
  cancelSale(id: number) {
    if (confirm('¿Está seguro de cancelar esta venta? El stock se devolverá al inventario.')) {
      this.saleService.cancelSale(id).subscribe(() => {
        this.snackBar.open('Venta cancelada con éxito', 'OK');
        this.loadSales(); // Recargar tabla
      });
    }
  }
  private updateChart() {
    const data = this.dataSource.filteredData;
    
    // 1. Agrupar totales por fecha
    const salesByDate = data.reduce((acc: any, sale: any) => {
      const date = formatDate(sale.fecha_venta, 'dd/MM', 'en-US');
      acc[date] = (acc[date] || 0) + parseFloat(sale.total_final);
      return acc;
    }, {});

    const labels = Object.keys(salesByDate).reverse(); // Fechas
    const values = Object.values(salesByDate).reverse(); // Totales

    // 2. Si ya existe una gráfica, destruirla antes de crear la nueva
    if (this.chart) {
      this.chart.destroy();
    }

    // 3. Crear la gráfica
    this.chart = new Chart(this.salesChartCanvas.nativeElement, {
      type: 'bar', // Puedes cambiar a 'bar' si prefieres
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas Diarias ($)',
          data: values,
          // borderColor: '#3f51b5',
          borderColor: 'rgb(54, 162, 235)',
          // backgroundColor: 'rgba(63, 81, 181, 0.1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 3,
          // fill: true,
          // tension: 0.4 // Curvatura de la línea
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => '$' + value }
          }
        }
      }
    });
  }
  exportExcel() {
  // Mapeamos los datos para que las columnas de Excel tengan nombres bonitos
    const dataToExport = this.dataSource.filteredData.map(sale => ({
      'Folio': sale.id_venta,
      'Fecha': sale.fecha_venta,
      'Vendedor': sale.vendedor,
      'Método': sale.metodo_pago,
      'Subtotal': sale.subtotal,
      'Descuento': sale.descuento_global,
      'Impuestos': sale.impuestos,
      'Total': sale.total_final,
      'Estatus': sale.estatus_venta
    }));

    this.exportService.exportToExcel(dataToExport, 'Reporte_Ventas');
  }

  exportPdf() {
    const columns = ['Folio', 'Fecha', 'Vendedor', 'Método', 'Total', 'Estatus'];
    const dataToExport = this.dataSource.filteredData.map(sale => [
    `#${sale.id_venta}`,
    new Date(sale.fecha_venta).toLocaleDateString(), // Fecha legible
    sale.vendedor,
    sale.metodo_pago,
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(sale.total_final), // Moneda
    sale.estatus_venta.toUpperCase()
    ]);

    this.exportService.exportToPdf(columns, dataToExport, 'Reporte de Ventas');
  }
  /**
 * Obtiene las estadísticas basadas en los datos filtrados actualmente
 */
  get stats() {
    const data = this.dataSource.filteredData.filter(s => s.estatus_venta !== 'cancelada');
    const totalCount = data.length;
    
    if (totalCount === 0) {
      return { promedio: 0, maxima: 0, total: 0 };
    }

    const sumaTotal = data.reduce((acc, s) => acc + parseFloat(s.total_final), 0);
    const maxima = Math.max(...data.map(s => parseFloat(s.total_final)));
    const promedio = sumaTotal / totalCount;

    return {
      promedio,
      maxima,
      total: totalCount
    };
  }
  clearFilters() {
    this.filterFolio = '';
    this.startDate = null;
    this.endDate = null;
    this.loadSales();
  }
}