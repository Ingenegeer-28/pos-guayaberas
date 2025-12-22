// src/app/core/services/sale.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Root, SaleRequest, SaleResponse } from '../models/sale.model';
// import { SaleRequest, SaleResponse } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly API_SALES_URL = 'http://localhost/api-guaya-pos/ventas/index.php';

  constructor(private http: HttpClient) { }

  /**
   * Registra una nueva venta en el sistema.
   */
  createSale(saleData: SaleRequest): Observable<SaleResponse> {
    console.log(saleData);
    return this.http.post<SaleResponse>(this.API_SALES_URL, saleData);
  }

  // getSales(): Observable<{success: boolean, data: any[]}> {
  //   return this.http.get<{success: boolean, data: any[]}>(this.API_SALES_URL);
  // }
  getSales(filters?: { id_venta?: string, inicio?: string, fin?: string }): Observable<any> {
    let params = new HttpParams();
    if (filters?.id_venta) params = params.set('id_venta', filters.id_venta);
    if (filters?.inicio) params = params.set('fecha_inicio', filters.inicio);
    if (filters?.fin) params = params.set('fecha_fin', filters.fin);

    return this.http.get(`${this.API_SALES_URL}`, { params });
  }

  getSaleById(id: number): Observable<Root> {
    return this.http.get<Root>(`${this.API_SALES_URL}/${id}`);
  }
  cancelSale(idVenta: number): Observable<any> {
    // El método DELETE en nuestra API ya maneja la devolución de stock
    return this.http.delete(`${this.API_SALES_URL}/${idVenta}`);
  } 
  /**
   * Obtiene el historial de ventas (opcional para reportes).
   */
  getSalesHistory(): Observable<any> {
    return this.http.get(this.API_SALES_URL);
  }
}