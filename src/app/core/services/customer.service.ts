import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';

export interface Cliente {
  id_cliente?: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rfc?: string;
  estatus?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  // private readonly API_URL = `${environment.apiUrl}/clientes`;
  private readonly API_URL =
    'http://localhost/api-guaya-pos/clientes/index.php';

  constructor(private http: HttpClient) {}

  /**
   * Buscar clientes por nombre o teléfono (Autocompletado)
   */
  searchCustomers(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get<any>(this.API_URL, { params });
  }
  getClients(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }

  /**
   * Registrar un nuevo cliente
   */
  createCustomer(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.API_URL, cliente);
  }

  updateCustomer(client: Cliente): Observable<any> {
      const id = client.id_cliente;
      // El backend de PHP espera un PUT para actualizar
      return this.http.put<any>(`${this.API_URL}/${id}`, client);
    }

  /**
   * DELETE /api/usuarios/{id}: Elimina un usuario por su ID.
   */
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
