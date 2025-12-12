// src/app/core/guards/role.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      // 1. Obtener los roles permitidos definidos en la ruta
      const expectedRoles = route.data['roles'] as string[];
      
      if (!expectedRoles) {
        // Si no se define un rol, asumimos que solo se requiere autenticación (AuthGuard debería manejar esto)
        return true; 
      }
      
      // 2. Comprobar si el usuario está autenticado Y tiene el rol requerido
      const hasRole = this.authService.hasRole(expectedRoles);
      const isAuthenticated = this.authService.hasToken(); // Asume que AuthGuard no se ha ejecutado

      if (isAuthenticated && hasRole) {
        // 3. Si tiene el token y el rol, permitir acceso
        return true;
      } else {
        // 4. Si no tiene el rol, redirigir a una página de acceso denegado o al login
        console.warn('Acceso denegado por rol. Rol requerido:', expectedRoles);
        
        // Redirigir al login o a una página 403 (Forbidden)
        if (!isAuthenticated) {
            return this.router.createUrlTree(['/auth/login']);
        } else {
            return this.router.createUrlTree(['/']); // Asume una ruta de acceso denegado
        }
      }
  }
}