import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/components/layout/layout.component';

const routes: Routes = [
  // 1. Ruta de Login (Módulo Auth)
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  // 2. Ruta de Layout (Contenedor principal)
  {
    path: '',
    component: LayoutComponent, // El Layout es el componente padre
    canActivate: [AuthGuard], // Proteger TODO lo que esté dentro de este path
    children: [
      // Rutas anidadas que se cargarán en el <router-outlet> del Layout
      {
        path: 'pos',
        loadChildren: () =>
          import('./modules/pos/pos.module').then((m) => m.PosModule),
        data: { title: 'Punto de Venta' }, // Añadir título
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('./modules/catalog/catalog.module').then((m) => m.CatalogModule),
        data: { title: 'Gestión de Inventario' }, // Añadir título
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./modules/reports/reports.module').then((m) => m.ReportsModule),
        data: { title: 'Reportes y Analítica' }, // Añadir título
      },
      {
        path: 'models',
        loadChildren: () => import('./modules/models/models.module').then(m => m.ModelsModule),
        data: { title: 'Configuración de Modelos' } // Añadir título
      },
      {
        path: 'users',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
        data: { title: 'Configuración de usuarios' } // Añadir título
      },
      // Redirigir el path vacío a la ruta POS por defecto
      { path: '', redirectTo: 'pos', pathMatch: 'full' },
    ],
  },
  // { path: 'pos', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  // { path: 'catalog', loadChildren: () => import('./modules/catalog/catalog.module').then(m => m.CatalogModule) },
  // { path: 'pos', loadChildren: () => import('./modules/pos/pos.module').then(m => m.PosModule) },
  // { path: 'reports', loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule) },
  // 3. Redirecciones
  // Redirigir la raíz ('/') a la ruta principal del POS, pero la protegeremos
  { path: '', redirectTo: 'pos', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
