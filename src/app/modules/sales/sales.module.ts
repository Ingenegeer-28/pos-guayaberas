import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaleDetailDialogComponent } from './components/sale-detail-dialog/sale-detail-dialog.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderPaymentDialogComponent } from './components/order-payment-dialog/order-payment-dialog.component';
import { OrderDialogComponent } from './components/order-dialog/order-dialog.component';
import { CustomerFormDialogComponent } from './components/customer-form-dialog/customer-form-dialog.component';
import { OrderCheckoutDialogComponent } from './components/order-checkout-dialog/order-checkout-dialog.component';


@NgModule({
  declarations: [
    SalesHistoryComponent,
    SaleDetailDialogComponent,
    OrderListComponent,
    OrderPaymentDialogComponent,
    OrderDialogComponent,
    CustomerFormDialogComponent,
    OrderCheckoutDialogComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule
  ]
})
export class SalesModule { }
