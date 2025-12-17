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
    id_producto: number | null;
    id_modelo: number;
    nombre: string;
    descripcion: string;
    sku: string; //id_modelo-id_talla-id_manga-id_color
    precio: number;
    stock: number;
    id_manga: string;
    id_talla: number;
    id_color: number;
    estatus_producto: boolean;
    id_departamento: string;
    tipo_producto: string;
    foto: string;
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