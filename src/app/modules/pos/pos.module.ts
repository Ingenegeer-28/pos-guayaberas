import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRoutingModule } from './pos-routing.module';
import { PosComponent } from './pos.component';
import { PosPageComponent } from './pages/pos-page/pos-page.component';
import { ProductSelectorComponent } from './components/product-selector/product-selector.component';
import { CartDetailComponent } from './components/cart-detail/cart-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaleConfirmationDialogComponent } from './components/sale-confirmation-dialog/sale-confirmation-dialog.component';


@NgModule({
  declarations: [
    PosComponent,
    PosPageComponent,
    ProductSelectorComponent,
    CartDetailComponent,
    SaleConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    PosRoutingModule,
    SharedModule
  ]
})
export class PosModule { }
