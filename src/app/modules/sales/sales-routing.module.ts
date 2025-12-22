import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';

const routes: Routes = [{ path: '', component: SalesHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
