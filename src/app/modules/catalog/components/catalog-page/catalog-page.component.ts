import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ModelView } from 'src/app/core/models/pos.model';
import { Product } from 'src/app/core/models/product.model';

// Importa el servicio y las nuevas interfaces de modelo/variante
import { ProductService } from 'src/app/core/services/product.service'; // Asegúrate de que ModelView y ProductVariant estén aquí

@Component({
  selector: 'app-catalog-page',
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.css']
})
export class CatalogPageComponent implements OnInit, OnDestroy {

  // Controla la vista: 'models' (cuadrícula inicial) o 'variants' (detalle del modelo)
  viewState: 'models' | 'variants' = 'models';
  currentFilterValue: string = '';
  // Lista original de modelos (sin filtrar)
  allModels: ModelView[] = [];
  modelsToDisplay: ModelView[] = [];
  // Observable que contiene la lista de modelos agrupados
  models$!: Observable<ModelView[]>; 
  
  // Modelo seleccionado por el usuario
  selectedModel: ModelView | null = null;
  
  // Lista de variantes del modelo seleccionado que se mostrarán
  variantsToDisplay: Product[] = []; 
  private modelsSubscription!: Subscription;
  // La lógica de la tabla (dataSource, paginator, sort, displayedColumns, productSubscription, applyFilter)
  // ya no es necesaria en este componente refactorizado, por lo que se elimina.

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Suscripción al Observable de modelos agrupados
    // Se asume que productService.getGroupedModels() es accesible y funcional.
    // 👈 Llamar al nuevo método que agrupa los productos por modelo
    this.modelsSubscription = this.productService.getGroupedModels().subscribe({
      next: (models) => {
        this.allModels = models;
        this.modelsToDisplay = models; // Inicialmente muestra todos los modelos
      },
      error: (err) => {
        console.error('Error al cargar y agrupar modelos:', err);
        // Mostrar un mensaje de error o una alerta al usuario
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.currentFilterValue = filterValue;

    if (!filterValue) {
      this.modelsToDisplay = this.allModels;
      return;
    }
    
    // Lógica de filtrado de modelos basada en el filtro
    this.modelsToDisplay = this.allModels.filter(model => {
      // 1. Buscar coincidencia en el nombre del modelo
      if (model.descripcion.toLowerCase().includes(filterValue)) {
          return true;
      }
      
      // 2. Buscar coincidencia en las propiedades de las variantes (color, talla, SKU)
      const variantMatch = model.products.some(variant => {
        const sku = `${variant.modelo_descripcion}-${variant.talla_descripcion}-${variant.color_descripcion}`; 

        return (
          variant.color_descripcion.toLowerCase().includes(filterValue) ||
          variant.talla_descripcion.toLowerCase().includes(filterValue) ||
          variant.nombre.toLowerCase().includes(filterValue) ||
          sku.toLowerCase().includes(filterValue) // Incluir la búsqueda por SKU
        );
      });
      
      return variantMatch;
    });
  }
  /**
   * Navega a la vista de variantes del modelo seleccionado.
   * @param model El objeto ModelView seleccionado.
   */
  selectModel(model: ModelView): void {
    this.selectedModel = model;
    this.variantsToDisplay = model.products; 
    this.viewState = 'variants';
  }

  goBackToModels(): void {
    this.selectedModel = null;
    this.variantsToDisplay = [];
    this.viewState = 'models';
    // Restablecer la lista de modelos al volver
    this.modelsToDisplay = this.allModels;
  }

  editProduct(variant: Product): void {
    this.router.navigate(['/catalog/edit', variant.id_producto]);
  }
  
  ngOnDestroy(): void {
    if (this.modelsSubscription) {
      this.modelsSubscription.unsubscribe();
    }
  }
  
  // Se elimina applyFilter() ya que la tabla se reemplaza por la cuadrícula.
}