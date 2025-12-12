import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';



@NgModule({
  declarations: [
    FilterPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    MaterialModule,    
    FormsModule, // Exporta módulos de Angular de uso común
    ReactiveFormsModule,
    CommonModule // También útil exportar CommonModule a veces
  ]
})
export class SharedModule { }
