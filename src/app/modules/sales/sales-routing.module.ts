import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';
import { OrderListComponent } from './components/order-list/order-list.component';

const routes: Routes = [
  { 
    path: '', 
    component: SalesHistoryComponent 
  },
  { 
    path: 'orders', 
    component: OrderListComponent,
    data: { title: 'Ordenes' } // Ruta para ver métricas de stock
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
