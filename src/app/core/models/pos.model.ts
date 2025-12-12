import { Product } from "./product.model";

export interface ProductVariant {
  // Propiedades necesarias para el filtro y la visualización
  id_producto: string;
  descripcion: string;
  nombre: string;
  sku: string; // Asumimos SKU basado en variantes
  precio: string;
  cantidad: number; // Stock
  foto: string; 
  
  // Propiedades de la variante para el filtro
  modelo_descripcion:string;
  talla_descripcion: string;
  departamento_descripcion: string;
  color_descripcion: string;
  manga_descripcion: string;
}

export interface ModelView {
  id_modelo: string;
  descripcion: string;
  products: Product[];
}