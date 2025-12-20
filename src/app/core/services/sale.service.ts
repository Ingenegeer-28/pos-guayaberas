// src/app/core/services/sale.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleRequest, SaleResponse } from '../models/sale.model';
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

  /**
   * Obtiene el historial de ventas (opcional para reportes).
   */
  getSalesHistory(): Observable<any> {
    return this.http.get(this.API_SALES_URL);
  }
}