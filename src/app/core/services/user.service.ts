// src/app/core/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // URL base de tu API de PHP (asegúrate de que esta ruta sea correcta)
  private readonly API_URL = 'http://localhost/api-guaya-pos/usuarios/index.php'; 

  constructor(private http: HttpClient) { }

  /**
   * GET /api/usuarios: Obtiene la lista completa de usuarios.
   */
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.API_URL);
  }

  /**
   * GET /api/usuarios/{id}: Obtiene un solo usuario.
   */
  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/${id}`);
  }

  /**
   * POST /api/usuarios: Crea un nuevo usuario.
   * @param user Los datos del usuario (debe incluir password).
   */
  createUser(user: User): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.API_URL, user);
  }

  /**
   * PUT /api/usuarios/{id}: Actualiza un usuario existente.
   * @param user Los datos a actualizar.
   */
  updateUser(user: User): Observable<ApiResponse<any>> {
    const id = user.id_usuario;
    // El backend de PHP espera un PUT para actualizar
    return this.http.put<ApiResponse<any>>(`${this.API_URL}/${id}`, user);
  }

  /**
   * DELETE /api/usuarios/{id}: Elimina un usuario por su ID.
   */
  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`);
  }
}