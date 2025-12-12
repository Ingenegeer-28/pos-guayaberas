import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      // 1. Tomamos el valor actual del observable isAuthenticated$
      //    'take(1)' asegura que nos desuscribimos inmediatamente.
      return this.authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
          if (isAuthenticated) {
            // 2. Si el usuario está autenticado, permitimos el acceso (true)
            return true;
          } else {
            // 3. Si NO está autenticado, lo redirigimos a la ruta de login.
            //    'UrlTree' permite devolver una redirección inmediata.
            console.log('Acceso denegado. Redirigiendo a Login.');
            return this.router.createUrlTree(['/auth/login']); 
          }
        }),
        // Opcional: usar tap() para efectos secundarios como logging.
        tap(isAllowed => {
          if (isAllowed !== true) {
            // El mensaje de redirección ya se maneja en el map, pero es buen lugar para logging.
          }
        })
      );
  }
}