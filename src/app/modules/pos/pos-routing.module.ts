import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosPageComponent } from './pages/pos-page/pos-page.component';

const routes: Routes = [
  {
    // Ruta base del módulo POS (ej. /pos)
    path: '',
    component: PosPageComponent,
    // La data se hereda del Layout, pero se puede redefinir aquí:
    data: { title: 'Punto de Venta' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosRoutingModule {}
