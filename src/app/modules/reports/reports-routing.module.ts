import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { SalesReportComponent } from './pages/sales-report/sales-report.component';
import { InventoryReportComponent } from './pages/inventory-report/inventory-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsPageComponent, // Contenedor principal de los reportes
    children: [
      { 
        path: '', 
        redirectTo: 'sales', 
        pathMatch: 'full' // Redirige la ruta /reports a /reports/sales
      },
      { 
        path: 'sales', 
        component: SalesReportComponent,
        data: { title: 'Análisis de Ventas' } // Ruta para ver métricas de ventas
      },
      { 
        path: 'inventory', 
        component: InventoryReportComponent,
        data: { title: 'Reporte de Inventario' } // Ruta para ver métricas de stock
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
