// src/app/modules/admin/components/layout/layout.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  pageTitle: string = 'Bienvenido a GuayaPos';
  userName: string | null; // Nuevo: Para mostrar el nombre en el toolbar
  openSideNav = true;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService // 🚨 MODIFICACIÓN CLAVE: hacerlo público
  ) {
    // Obtener el nombre del usuario que se guardó durante el login
    this.userName = localStorage.getItem('user_name');
  }

  // ... (ngOnInit y getRouteTitle se mantienen) ...

  ngOnInit(): void {
    // Suscripción para obtener el título de la página de la data de la ruta
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.openSideNav = !result.matches;
      });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getRouteTitle(this.activatedRoute.root))
      )
      .subscribe((title) => {
        this.pageTitle = title || 'Sistema POS';
      });
  }

  // Método para buscar el título en la estructura de rutas
  private getRouteTitle(route: ActivatedRoute): string | null {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data['title'];
  }

  // Método para logout
  logout(): void {
    this.authService.logout();
    // La redirección a /login se maneja dentro del AuthService.logout()
  }

  // Getter para mostrar el título en el Toolbar
  getTitle(): string {
    return this.pageTitle;
  }
}
