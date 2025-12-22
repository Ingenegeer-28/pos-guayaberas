import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaleDetailDialogComponent } from './components/sale-detail-dialog/sale-detail-dialog.component';


@NgModule({
  declarations: [
    SalesHistoryComponent,
    SaleDetailDialogComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule
  ]
})
export class SalesModule { }
