import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Es crucial registrar todos los elementos de Chart.js
Chart.register(...registerables); 

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit, AfterViewInit {
  
  // Referencia al elemento <canvas> en el HTML
  @ViewChild('salesChartCanvas') canvas!: ElementRef;
  
  salesForm!: FormGroup;
  public salesChart!: Chart;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Inicialización del formulario de filtros
    this.salesForm = this.fb.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      interval: ['daily'] // daily, weekly, monthly
    });
  }

  // Se ejecuta después de que la vista (incluyendo el canvas) ha sido inicializada
  ngAfterViewInit(): void {
    this.createSalesChart();
  }

  createSalesChart(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    
    // 1. Datos de Venta de Prueba (Simulación)
    const data = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Ventas (MXN)',
        data: [1200, 1900, 300, 500, 200, 3000, 1500],
        borderColor: '#3f51b5', // Color Primario de Material
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        tension: 0.4, // Curva suave
        fill: true,
      }]
    };
    
    // 2. Configuración de la Gráfica
    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false, // Permite que la gráfica se ajuste al contenedor CSS
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ventas de la Semana Actual'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // 3. Creación de la instancia de Chart
    this.salesChart = new Chart(ctx, config);
  }
  
  generateReport(): void {
    console.log('Generando reporte con filtros:', this.salesForm.value);
    // Aquí se llamaría a un servicio de reportes para obtener datos nuevos 
    // y luego actualizarías la gráfica: this.salesChart.update();
  }
}