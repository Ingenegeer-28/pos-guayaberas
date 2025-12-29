// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 🚨 REEMPLAZA esta URL con la ruta exacta de tu API de PHP (ej. http://localhost/api/auth/login)
  private readonly LOGIN_API_URL =
    'http://localhost/api-guaya-pos/auth/login.php';

  // Estado de Autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Estado del Rol (Necesario para mostrar/ocultar menús)
  private userRoleSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('user_role')
  );
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkTokenOnStartup();
  }

  // --- GETTERS DE ESTADO ---
  hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  // --- MÉTODOS PÚBLICOS ---

  getCurrentUser() {
    const user_id = localStorage.getItem('user_id'); // O la llave que uses para guardar el login
    if (user_id) {
      return user_id;
    }
    return null;
  }
  /**
   * Conexión real con la API de PHP.
   */
  login(credentials: any): Observable<AuthResponse> {
    // 1. Llamada HTTP real al backend
    return this.http.post<AuthResponse>(this.LOGIN_API_URL, credentials).pipe(
      tap((response) => {
        if (response.success && response.token) {
          // 2. Almacenar credenciales y rol
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_role', response.user.rol);
          localStorage.setItem('user_name', response.user.nombre);
          localStorage.setItem('user_id', response.user.id_usuario.toString());
          // 3. Actualizar Observables
          this.isAuthenticatedSubject.next(true);
          this.userRoleSubject.next(response.user.rol);

          // 4. Redireccionar basado en el rol
          this.redirectUser(response.user.rol);
        }
      })
    );
  }

  /**
   * Cierra la sesión y limpia el almacenamiento local.
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');

    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // --- LÓGICA INTERNA DE REDIRECCIÓN ---

  private redirectUser(role: string): void {
    if (role === 'admin') {
      // Redirige al dashboard de administración
      this.router.navigate(['/models']);
    } else if (role === 'empleado') {
      // Redirige al TPV (Punto de Venta)
      this.router.navigate(['/pos']);
    } else {
      // Rol desconocido
      this.router.navigate(['/']);
    }
  }

  hasRole(requiredRoles: string[]): boolean {
    const userRole = this.getRole();
    if (!userRole) {
      return false;
    }
    // Comprueba si el rol del usuario está incluido en la lista de roles permitidos
    return requiredRoles.includes(userRole);
  }
  private checkTokenOnStartup(): void {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    if (token && role) {
      this.isAuthenticatedSubject.next(true);
      this.userRoleSubject.next(role);
    } else {
      // Limpiar por si quedó un token huérfano
      localStorage.clear();
      this.logout();
    }
  }
}
