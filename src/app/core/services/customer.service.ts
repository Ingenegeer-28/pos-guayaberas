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
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  // private readonly API_URL = `${environment.apiUrl}/clientes`;
  private readonly API_URL = 'http://localhost/api-guaya-pos/clientes/index.php'; 

  constructor(private http: HttpClient) {}

  /**
   * Buscar clientes por nombre o teléfono (Autocompletado)
   */
  searchCustomers(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get<any>(this.API_URL, { params });
  }

  /**
   * Registrar un nuevo cliente
   */
  createCustomer(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.API_URL, cliente);
  }
}
