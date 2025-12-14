import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelsRoutingModule } from './models-routing.module';
import { ModelsPageComponent } from './pages/models-page/models-page.component';
import { ModelFormComponent } from './components/model-form/model-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReferenceModalComponent } from './components/reference-modal/reference-modal.component';
import { ReferenceFormComponent } from './components/reference-form/reference-form.component';


@NgModule({
  declarations: [
    ModelsPageComponent,
    ModelFormComponent,
    ReferenceModalComponent,
    ReferenceFormComponent
  ],
  imports: [
    CommonModule,
    ModelsRoutingModule,
    SharedModule
  ]
})
export class ModelsModule { }
