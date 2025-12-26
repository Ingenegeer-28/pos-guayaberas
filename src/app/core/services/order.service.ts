import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Apunta a la carpeta donde está tu nuevo index.php
  // private readonly API_URL = `${environment.apiUrl}/pedidos`;
   private readonly API_URL = 'http://localhost/api-guaya-pos/orders/index.php'; 

  constructor(private http: HttpClient) {}

  /**
   * GET: Obtener lista de pedidos con filtros opcionales
   */
  getOrders(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters?.estado) params = params.set('estado', filters.estado);
    if (filters?.id_cliente) params = params.set('id_cliente', filters.id_cliente);
    
    return this.http.get<any>(this.API_URL, { params });
  }

  /**
   * GET: Obtener detalle completo de un pedido por ID
   * Endpoint: /api/pedidos/{id}
   */
  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  /**
   * POST: Crear un nuevo pedido con ítems y abono inicial
   */
  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.API_URL, orderData);
  }

  /**
   * PUT: Actualizar el estado de fabricación (Taller)
   * Enviamos 'nuevo_estado' en el cuerpo
   */
  updateFabricationStatus(id: number, status: string): Observable<any> {
    const body = { nuevo_estado: status };
    return this.http.put<any>(`${this.API_URL}/${id}`, body);
  }

  /**
   * PUT: Registrar un nuevo abono (Cobro de saldo)
   * Enviamos 'monto_abono' en el cuerpo
   */
  addPayment(id: number, amount: number, method: string): Observable<any> {
    const body = { 
      monto_abono: amount, 
      metodo_pago: method 
    };
    console.log(body);
    return this.http.put<any>(`${this.API_URL}/${id}`, body);
  }
}