import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogPageComponent } from './components/catalog-page/catalog-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductFormComponent } from './components/product-form/product-form.component';


@NgModule({
  declarations: [
    CatalogPageComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule
  ]
})
export class CatalogModule { }
