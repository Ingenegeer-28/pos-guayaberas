import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelsPageComponent } from './pages/models-page/models-page.component';
import { ModelFormComponent } from './components/model-form/model-form.component';

const routes: Routes = [
  {
    path: '',
    component: ModelsPageComponent, // Muestra la lista de modelos
    data: { title: 'Configuración de Modelos' }
  },
  {
    path: 'new',
    component: ModelFormComponent, // Crear nuevo modelo
    data: { title: 'Crear Nuevo Modelo' }
  },
  {
    path: 'edit/:id',
    component: ModelFormComponent, // Editar modelo existente
    data: { title: 'Editar Modelo' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelsRoutingModule { }
