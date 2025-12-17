import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { Model, Reference } from 'src/app/core/models/config.model';
import { ModelConfigService } from 'src/app/core/services/model-config.service';

@Component({
  selector: 'app-models-page',
  templateUrl: './models-page.component.html',
  styleUrls: ['./models-page.component.css'],
})
export class ModelsPageComponent implements OnInit, OnDestroy {
  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['id', 'descripcion', 'actions'];

  modelos: Reference[] = [];
  // Fuente de datos de la tabla de Material
  dataSource!: MatTableDataSource<Reference>;

  private modelsSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private modelConfigService: ModelConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerModelos();
    // 1. Suscripción al Observable de modelos (cargado desde el JSON)
    // this.modelsSubscription = this.modelConfigService
    //   .getModels()
    //   .subscribe((models) => {
    //     // 2. Inicializar el DataSource de Material
    //     this.dataSource = new MatTableDataSource(models);

    //     // 3. Asignar paginador y ordenamiento (solo funciona después de inicializar el DataSource)
    //     // Se asignan dentro de la suscripción para asegurar que las referencias @ViewChild existan
    //     setTimeout(() => {
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //     }, 0);
    //   });
  }

  // Método para el filtro (búsqueda)
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerModelos(): void{
    this.modelConfigService.getModelos().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.modelos = data;
    });
  }
  // Navegación para crear nuevo modelo
  navigateNewModel(): void {
    this.router.navigate(['/models/new']);
  }

  // Navegación para editar modelo
  editModel(modelId: number): void {
    this.router.navigate(['/models/edit', modelId]);
  }

  ngOnDestroy(): void {
    if (this.modelsSubscription) {
      this.modelsSubscription.unsubscribe();
    }
  }
}
