import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, map, startWith, Subscription } from 'rxjs';
import { CartSummary } from 'src/app/core/models/cart.model';
import { ConfigDataResponse, Reference } from 'src/app/core/models/config.model';
import { ModelView, ProductVariant } from 'src/app/core/models/pos.model';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ModelConfigService } from 'src/app/core/services/model-config.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.css'],
})
export class ProductSelectorComponent implements OnInit {
  // Estado de la vista: muestra la lista de modelos o los productos de un modelo
  viewState: 'models' | 'products' = 'models';

  // Modelo seleccionado actualmente
  selectedModel: ModelView | null = null;

  allModels: ModelView[] = [];
  modelsToDisplay: ModelView[] = [];
  // Lista de modelos agrupados
  // models$!: Observable<ModelView[]>;
  todosModelos$: Observable<ModelView[]> = this.productService.availableModels$;
  models$: Observable<ModelView[]> = this.todosModelos$;

  cart$: Observable<CartSummary> = this.cartService.cart$
  // Datos de referencia para los filtros (tallas, colores, etc.)
  references$!: Observable<ConfigDataResponse>;

  // Fuente de datos de los productos del modelo seleccionado
  modelProductsSource: Product[] = [];
  // Productos que se muestran en la cuadrícula (después de aplicar filtros)
  productsToDisplay: Product[] = [];
  variantsToDisplay: Product[] = [];
  private modelsSubscription!: Subscription;
  // Filtros de búsqueda (Reactive Forms o ngModel - usaremos ngModel para simplicidad)
  filterTalla: string = '';
  filterColor: string = '';
  filterDepto: string = '';
  filterManga: string = '';

  departamentos: Reference[] = [];
  tallas: Reference[] = [];
  colores: Reference[] = [];
  modelos: Reference[] = [];
  mangas: Reference[] = [];

  // Lista de productos del modelo seleccionado, después de aplicar filtros
  filteredProducts$!: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private configService: ModelConfigService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Cargar todos los datos de referencia para los selectores de filtro
    // this.references$ = this.configService.getReferences();
    this.loadReferences();
    // Aquí cargarías y agruparías los productos del backend/JSON por modelo
    // this.models$ = this.productService.getGroupedModels(); // <-- ASUME que este método existe
    // this.modelsSubscription = this.productService.getGroupedModels().subscribe({
    //   next: (models) => {
    //     this.allModels = models;
    //     this.modelsToDisplay = models; // Inicialmente muestra todos los modelos
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar y agrupar modelos:', err);
    //     // Mostrar un mensaje de error o una alerta al usuario
    //   },
    // });
    // Inicializar el observable de productos filtrados (lógica avanzada)
    // this.setupFilteredProducts();
    // this.models$.subscribe({
    //   next:(model)=>{

    //   },
    //   error: (err)=> {

    //   }
    // })
  }

  // 1. Navegación: Seleccionar un modelo para ver sus productos
  selectModel(model: ModelView): void {
    this.selectedModel = model;
    this.viewState = 'products';
    // Inicializar la fuente y la vista de productos
    this.modelProductsSource = model.products;
    this.resetAndApplyFilters(); // Cargar todos los productos del modelo
  }

  // 2. Navegación: Volver a la vista de modelos
  goBackToModels(): void {
    this.viewState = 'models';
    this.selectedModel = null;
    this.resetAndApplyFilters();
  }
  // 3. Método central que aplica todos los filtros y actualiza productsToDisplay
  applyFilters(): void {
    let filtered = this.modelProductsSource;

    // Aplicación de todos los filtros seleccionados
    if (this.filterTalla) {
      filtered = filtered.filter(
        (p) => p.talla_descripcion === this.filterTalla
      );
    }
    if (this.filterColor) {
      filtered = filtered.filter(
        (p) => p.color_descripcion === this.filterColor
      );
    }
    if (this.filterDepto) {
      filtered = filtered.filter(
        (p) => p.departamento_descripcion === this.filterDepto
      );
    }
    if (this.filterManga) {
      filtered = filtered.filter(
        (p) => p.manga_descripcion === this.filterManga
      );
    }
    this.productsToDisplay = filtered;
  }

  // 4. Resetear filtros
  resetAndApplyFilters(): void {
    this.filterTalla = '';
    this.filterColor = '';
    this.filterDepto = '';
    this.filterManga = '';
    this.applyFilters();
  }

  // 3. Lógica de Filtrado Reactivo
  setupFilteredProducts(): void {
    // Usamos BehaviorSubjects para hacer que los filtros sean reactivos
    const filterChanges$ = combineLatest([
      // Emitir el modelo seleccionado (o null)
      this.models$.pipe(
        map(
          (models) =>
            models.find((m) => m.id_modelo === this.selectedModel?.id_modelo) ||
            null
        )
      ),
      // Crear un observable que combina todos los filtros de ngModel
      new BehaviorSubject<any>({}).pipe(
        startWith({
          talla: this.filterTalla,
          color: this.filterColor,
          depto: this.filterDepto,
          manga: this.filterManga,
        })
      ),
    ]);

    this.filteredProducts$ = filterChanges$.pipe(
      map(([model, filters]) => {
        if (!model) return [];

        return model.products.filter((p) => {
          // Aplicar filtros: Si el filtro está vacío (''), se acepta
          const matchTalla =
            !filters.talla || p.talla_descripcion === filters.talla;
          const matchColor =
            !filters.color || p.color_descripcion === filters.color;
          const matchDepto =
            !filters.depto || p.departamento_descripcion === filters.depto;
          const matchManga =
            !filters.manga || p.manga_descripcion === filters.manga;

          return matchTalla && matchColor && matchDepto && matchManga;
        });
      })
    );
  }

  // 4. Resetear filtros
  resetFilters(): void {
    this.filterTalla = '';
    this.filterColor = '';
    this.filterDepto = '';
    this.filterManga = '';
    // Necesitarías emitir un evento para notificar el cambio a setupFilteredProducts
    // (Si usas ngModel, la plantilla manejaría esto automáticamente si está vinculada)
    this.setupFilteredProducts();
  }

  // 5. Añadir al Carrito (igual que antes)
  addProductToCart(product: Product): void {
    // Debes convertir el ProductVariant a la interfaz Product para el CartService
    // Asumimos que CartService puede manejar la conversión
    if (product.cantidad > 0) {
      // Convertir ProductVariant a Product (o similar) que CartService espera
      this.cartService.addItem(product);
      // this.updateQuantity(product);
      // this.cartService.addItem(this.convertToProduct(product));
    } else {
      console.warn(`Stock bajo para ${product.nombre}`);
      // Mostrar notificación de stock insuficiente
    }
  }

  updateQuantity(producto: Product):void{
    // this.productsToDisplay.forEach(product=> {
    //   if (product.id_producto == producto.id_producto) {
    //     product.cantidad = product.cantidad -1;
    //   } 
    // })
    // this.models$.subscribe({
    //   next:(modelos =>{
    //     modelos.forEach(model=> {
    //       model.products.forEach(product =>{
    //         if (product.id_producto == producto.id_producto) {
    //           console.log(product.cantidad);
    //         }
    //       })
          
    //     })
    //   })
    // })
    // const prd = producto.cantidad;
    // this.cart$.subscribe({
    //   next:(respues =>{
    //     respues.items.forEach(item=> {
    //       if (item.product.id_producto == producto.id_producto) {
    //         console.log(item.product.cantidad);
    //         console.log(item.quantity);
            
    //       }
    //     })
    //   })
    // })

    // this.models$ = this.todosModelos$.pipe(
    //   map(model => model.filter(variand => {
    //     if(variand.descripcion.toLowerCase().includes(this.currentFilterValue)){
    //       return true;
    //     }else{
    //       return false;
    //     }
    //   }))
    // );
    // const allModels = this.productService.getAllModelsSync();
    // const model = allModels.find((modl) => modl.products.find((prod) => prod.id_producto == producto.id_producto));
    // // const model = allModels.filter((model) => model.products.find((prod)=> prod.id_producto == producto.id_producto))
    // model?.products.forEach(prod=>{
    //   if (prod.id_producto == producto.id_producto) {
    //     console.log(prod.cantidad);
    //   }
      
    // })
    // console.log(model);
    // producto.cantidad = producto.cantidad-1;
    
  }
  // private convertToProduct(variant: ProductVariant): Product {
  //     return {
  //         id: parseInt(variant.id_producto),
  //         name: variant.nombre + ' (' + variant.talla_descripcion + ' - ' + variant.color_descripcion + ')',
  //         price: parseFloat(variant.precio),
  //         stock: variant.cantidad,
  //         sku: variant.sku,
  //         size: variant.talla_descripcion,
  //         color: variant.color_descripcion,
  //         // Añadir otras propiedades necesarias para el carrito
  //     } as Product;
  // }

  reloadModels():void{
    this.productService.loadGroupedModelos();
  }
  loadReferences(): void {
    this.configService.getModelos().subscribe((data) => {
      this.modelos = data;
    });
    // Cargar mangas
    this.configService.getMangas().subscribe((data) => {
      this.mangas = data;
    });

    // Cargar Departamentos
    this.configService.getDepartamentos().subscribe((data) => {
      this.departamentos = data;
    });

    // Cargar Tallas
    this.configService.getTallas().subscribe((data) => {
      this.tallas = data;
    });

    // Cargar Colores
    this.configService.getColores().subscribe((data) => {
      this.colores = data;
    });
  }
}
