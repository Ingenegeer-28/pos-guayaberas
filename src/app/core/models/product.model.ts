// export interface Product {
//   id: number;
//   sku: string; // Stock Keeping Unit
//   name: string;
//   description: string;
//   price: number;
//   size: string; // Talla: S, M, L, XL, etc.
//   color: string;
//   stock: number; // Existencias
//   isActive: boolean;
// }


export interface ProductCreationRequest {
    nombre: string;
    descripcion: string;
    
    precio: number;
    stock: number;
    tipo_manga: string;
    talla: string;
    color: string;
    estatus_producto: number;
    departamento: string;
    tipo_producto: string;
    imagen: { imgT: string; imgValue: string }[];
    fechaCreacion: string;
    fechaActualizacion: string;
    insertar: any[];
}
export interface ProductListResponse {
  success: boolean;
  data: Product[];
}

export interface Product {
    id_producto: number ;
    nombre: string;
    sku: string; // Asumimos SKU basado en variantes
    id_modelo: string;
    modelo_descripcion: string;
    descripcion: string;
    id_departamento: string;
    departamento_descripcion: string;
    foto: string;
    cantidad: number; // Stock (lo convertiremos a número en JS)
    precio: string; // Mantener como string, ya que el JSON lo define así
    id_talla: string;
    talla_descripcion: string;
    id_manga: string;
    manga_descripcion: string;
    id_color: number; 
    color_descripcion: string;
    estatus_producto: string;
    tipo_producto: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
}