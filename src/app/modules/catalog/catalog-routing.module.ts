import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogPageComponent } from './components/catalog-page/catalog-page.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  // Ruta principal (Tabla de inventario)
  { path: '', component: CatalogPageComponent },
  // Ruta para crear un producto nuevo
  { path: 'new', component: ProductFormComponent,
    canActivate: [RoleGuard],
    data: { title: 'Crear Guayabera', roles: ['admin'] } },
  // Ruta para editar un producto existente (con ID en el URL)
  { path: 'edit/:id', component: ProductFormComponent, 
    canActivate: [RoleGuard],
    data: { title: 'Editar Guayabera', roles: ['admin'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
