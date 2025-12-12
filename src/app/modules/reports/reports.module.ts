import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { SalesReportComponent } from './pages/sales-report/sales-report.component';
import { InventoryReportComponent } from './pages/inventory-report/inventory-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReportsComponent,
    ReportsPageComponent,
    SalesReportComponent,
    InventoryReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }
