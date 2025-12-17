// src/app/core/services/model-config.service.ts

import { Injectable } from '@angular/core';
import { map, Observable, of, shareReplay } from 'rxjs';
import { ConfigDataResponse, Model, Reference } from '../models/config.model';
// import { mockConfigData } from './mock-config-data'; // 👈 Contiene el JSON completo
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ModelConfigService {
  private configUrl = 'assets/response.json';
  private readonly API_BASE_URL = 'http://localhost/api-guaya-pos/references/index.php/';
  // Exponer los modelos principales http://localhost/api-guaya-pos/usuarios/index.php
  // private models: Model[] = mockConfigData.modelos.filter((m, index, self) => 
  //   index === self.findIndex((t) => (
  //     t.descripcion === m.descripcion // Desduplicar por descripción
  //   ))
  // );
  private allConfigData$: Observable<ConfigDataResponse>;
  constructor(private http: HttpClient) { 
    this.allConfigData$ = this.http.get<ConfigDataResponse>(this.configUrl).pipe(
      shareReplay(1) // Cachea la respuesta para futuras solicitudes
    );
  }

  // // Obtener todos los datos de referencia (departamentos, mangas, colores, etc.)
  // getReferences(): Observable<ConfigDataResponse> {
  //   return this.allConfigData$;
  // }

  /**
   * Mapea un objeto de referencia de la API (ej: { id_talla: '...', descripcion: '...' })
   * al formato de Angular (ej: { id: '...', descripcion: '...' }).
   */
  private mapToGenericReference(table_name: string, data: any[]): Reference[] {
    // 1. Determinar el nombre específico de la clave primaria (PK)
    if (table_name == 'tipos_manga') {
      table_name = 'mangas'
    }
    const pk_name = table_name === 'colores' ? 'id_' + table_name.slice(0, -2) : 'id_' + table_name.slice(0, -1); // 'tallas' -> 'id_talla', 'modelos' -> 'id_modelo'
    // 2. Mapear cada elemento
    return data.map(item => ({
      // ✅ CORRECCIÓN: Usar la clave dinámica del backend para el campo 'id'
      id: item[pk_name], 
      descripcion: item.descripcion
    }));
  }

  /**
   * Obtiene la lista completa de referencias de una tabla específica y las mapea.
   * @param table_name El nombre de la tabla (ej. 'tallas', 'colores').
   */
  getReferences(table_name: string): Observable<Reference[]> {
    const url = `${this.API_BASE_URL}${table_name}`;
    
    return this.http.get<ApiResponse<any>>(url).pipe(
      map(response => {
        // 1. Obtener los datos sin procesar
        const rawData = response.data;
        // 2. Mapear los datos al formato 'Reference[]'
        return this.mapToGenericReference(table_name, rawData);
      })
    );
  }
  // Métodos de conveniencia (opcional, pero útil)
  getDepartamentos(): Observable<Reference[]> {
    return this.getReferences('departamentos');
  }
  getTallas(): Observable<Reference[]> {
    return this.getReferences('tallas');
  }
  getColores(): Observable<Reference[]> {
    return this.getReferences('colores');
  }
  getMangas(): Observable<Reference[]> {
    return this.getReferences('tipos_manga');
  }
  getModelos(): Observable<Reference[]> {
    return this.getReferences('modelos');
  }
  
  getReference(table_name: string, id: number): Observable<Reference> {
    return this.http.get<any>(`${this.API_BASE_URL}${table_name}/${id}`).pipe(
      map(response => {
        if (table_name == 'tipos_manga') {
          table_name = 'mangas'
        }
        const pk_name = table_name === 'colores' ? 'id_' + table_name.slice(0, -2) : 'id_' + table_name.slice(0, -1); // 'tallas' -> 'id_talla', 'modelos' -> 'id_modelo'
    
        const prodcuto = response.data;
        // console.log(response.data);
        const retornado : Reference = {
          id: response.data[pk_name],
          descripcion: response.data.descripcion
        }
        return retornado;
      })
    );
  }
  // --- MÉTODOS CRUD (POST, PUT, DELETE) ---

  createReference(table_name: string, descripcion: string): Observable<any> {
    const url = `${this.API_BASE_URL}${table_name}`;
    return this.http.post(url, { descripcion });
  }

  updateReference(table_name: string, id: string | number, descripcion: string): Observable<any> {
    const url = `${this.API_BASE_URL}${table_name}/${id}`;
    return this.http.put(url, { descripcion });
  }

  deleteReference(table_name: string, id: string | number): Observable<any> {
    const url = `${this.API_BASE_URL}${table_name}/${id}`;
    return this.http.delete(url);
  }


  // Obtener la lista de modelos desduplicados
  // getModels(): Observable<Model[]> {
  //   return this.allConfigData$.pipe(
  //     map(data => {
  //       console.log(data);
  //       // Realizar la desduplicación de modelos por descripción
  //       const uniqueModels = data.modelos.filter((m, index, self) => 
  //         index === self.findIndex((t) => (
  //           t.descripcion === m.descripcion
  //         ))
  //       );
  //       return uniqueModels;
  //     })
  //   );
  // }

  // getProducts(): Observable<Product[]> {
  //   return this.allConfigData$.pipe(
  //     map(data => {
  //       console.log(data);
  //       // Realizar la desduplicación de modelos por descripción
  //       const uniqueModels = data.productos.filter((m, index, self) => 
  //         index === self.findIndex((t) => (
  //           t.descripcion === m.descripcion
  //         ))
  //       );
  //       return uniqueModels;
  //     })
  //   );
  // }
  
  // Lógica para crear un nuevo modelo (simulación)
  createModel(description: string): Observable<Model> {
    const newModel: Model = {
      descripcion: description,
      id: '',
      id_modelo: 0
    };
    console.log(newModel);
    // this.models.push(newModel);
    return of(newModel);
  }
}

// Nota: El archivo mock-config-data.ts contendría el JSON completo que proporcionaste.