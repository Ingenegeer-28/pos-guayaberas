import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { Product, ProductListResponse } from '../models/product.model';
import { ModelView, ProductVariant } from '../models/pos.model';
import { ModelConfigService } from './model-config.service';
import { HttpClient } from '@angular/common/http';
// import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  // Propiedades Reactivas para Catálogo (Ya no son estáticas)
  private modelsSubject = new BehaviorSubject<ModelView[]>([]);
  public availableModels$ = this.modelsSubject.asObservable(); 
  // URL base de la API de PHP para productos
  private readonly API_PRODUCTS_URL = 'http://localhost/api-guaya-pos/productos/index.php'; 

  constructor(private configService: ModelConfigService,
    private http: HttpClient
  ) {
    this.loadGroupedModelos();
   }

  /**
   * Obtiene todos los productos/variantes del catálogo.
   */
  getProducts(): Observable<Product[]> {
    // GET: /api/products/
    return this.http.get<ProductListResponse>(this.API_PRODUCTS_URL).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene un producto/variante por su ID.
   */
  getProductById(id: number): Observable<Product> {
    // GET: /api/products/{id}
    return this.http.get<any>(`${this.API_PRODUCTS_URL}/${id}`).pipe(
      map(response => {
        const prodcuto = response.data;
        return prodcuto as Product;
      })
    );
  }
  /**
   * Crea un nuevo producto/variante.
   */
  createProduct(productData: any): Observable<any> {
    // POST: /api/products/
    return this.http.post(this.API_PRODUCTS_URL, productData);
  }

  updateProduct(id: number, productData: any): Observable<any> {
    // PUT: /api/products/{id}
    return this.http.put(`${this.API_PRODUCTS_URL}/${id}`, productData);
  }

  // Crea un nuevo producto
  // createProduct(product: Product): Observable<Product> {
  //   const newProduct = { ...product, id: Date.now(), sku: `G-${Date.now()}` };
  //   const currentProducts = this.productsSubject.getValue();
  //   this.productsSubject.next([...currentProducts, newProduct]);
  //   return of(newProduct);
  // }

  // Actualiza un producto (simulación)
  // updateProduct(updatedProduct: Product): Observable<Product> {
  //   const products = this.productsSubject.getValue();
  //   const index = products.findIndex(p => p.id === updatedProduct.id);
  //   if (index > -1) {
  //     products[index] = updatedProduct;
  //     this.productsSubject.next([...products]);
  //   }
  //   return of(updatedProduct);
  // }
  loadGroupedModelos():void{
    var modelados = this.getGroupedModels().subscribe({
      next: (models) => {
        console.log('Catálogo cargado desde la API.');
        this.modelsSubject.next(models);
      },
      error: (err) => {
        console.error('Error al cargar y agrupar modelos:', err);
        // Mostrar un mensaje de error o una alerta al usuario
      },
    });
  }
  public getAllModelsSync(): ModelView[] {
    return this.modelsSubject.value;
  }
  /**
   * Obtiene todos los productos de la API y los agrupa por Modelo para la vista de catálogo.
   * @returns Observable<ModelView[]>
   */
  getGroupedModels(): Observable<ModelView[]> {
    // 1. Llama a la API de productos para obtener la lista plana de variantes
    return this.http.get<ProductListResponse>(this.API_PRODUCTS_URL).pipe(
      map(response => response.data),
      
      // 2. Transforma la lista plana (Product[]) en ModelView[] (agrupados)
      
      map((products: Product[]) => {
        // Usamos un Map para agrupar las variantes por la descripción del modelo
        const groupedMap = products.reduce((acc, currentProduct) => {
          
          // La clave de agrupación es el nombre del modelo
          const modelKey = currentProduct.modelo_descripcion; 
          
          // Crear la variante que se mostrará en la lista de detalles
          const variant: Product = {
            // Mapear los campos planos a la estructura ProductVariant
            id_producto: currentProduct.id_producto,
            nombre: currentProduct.nombre,
            descripcion: currentProduct.descripcion,
            foto: currentProduct.foto,
            cantidad: currentProduct.cantidad,
            precio: currentProduct.precio,
            estatus_producto: currentProduct.estatus_producto,
            tipo_producto: currentProduct.tipo_producto,
            // SKU compuesto: Se asume que necesitas esto para el filtro
            sku: `${currentProduct.modelo_descripcion} - talla ${currentProduct.talla_descripcion} - ${currentProduct.color_descripcion}`,

            // Campos de referencia
            id_modelo: currentProduct.id_modelo,
            modelo_descripcion: currentProduct.modelo_descripcion,
            id_talla: currentProduct.id_talla,
            talla_descripcion: currentProduct.talla_descripcion,
            id_color: currentProduct.id_color,
            color_descripcion: currentProduct.color_descripcion,
            id_manga: currentProduct.id_manga,
            manga_descripcion: currentProduct.manga_descripcion,
            id_departamento: currentProduct.id_departamento,
            departamento_descripcion: currentProduct.departamento_descripcion,
            fecha_creacion: currentProduct.fecha_creacion,
            fecha_actualizacion: currentProduct.fecha_actualizacion
          };

          if (!acc.has(modelKey)) {
            // Si el modelo no existe en el mapa, inicializarlo
            acc.set(modelKey, {
              id_modelo: currentProduct.id_modelo, 
              descripcion: modelKey,
              foto: currentProduct.foto, // Usar la foto de la primera variante como foto del modelo
              products: [] as Product[]
            } as ModelView);
          }
          
          // Añadir la variante al grupo de productos del modelo
          acc.get(modelKey)!.products.push(variant);
          
          return acc;
        }, new Map<string, ModelView>()); 

        // 3. Convertir el Map de nuevo a un Array de ModelView para el componente
        return Array.from(groupedMap.values());
      })
    );
  }
}