// src/app/core/models/config.model.ts

import { Product } from "./product.model";

// Usaremos estas interfaces para los datos de referencia del JSON
export interface Reference {
  id: string | number;
  descripcion: string;
}

// Ejemplo para simplificar el uso:
export interface Departamento extends Reference {
  id_departamento: string | number; // O el nombre de tu PK
}
export interface Talla extends Reference {
  id_talla: string | number;
}
export interface Manga extends Reference{
  id_manga: string | number;
}
export interface Color extends Reference{
  id_color: string | number;
}
export interface Model extends Reference{
  id_modelo: number;
}

// Interfaz que simula la respuesta completa del backend
export interface ConfigDataResponse {
  statuscode: number;
  existeError: boolean;
  
  departamentos: Departamento[];
  mangas: Manga[];
  colores: Color[];
  tallas: Talla[];
  modelos: Model[];
  productos: Product[];
  // Los productos tienen más detalle, se usarán para referencia
}