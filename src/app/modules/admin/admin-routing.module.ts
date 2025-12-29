import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { ClientListComponent } from './pages/client-list/client-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [RoleGuard],
    data: { title: 'Gestión de Usuarios', roles: ['admin'] },
  },
  {
    path: 'clientes',
    component: ClientListComponent,
    data: { title: 'Clientes' }, // Ruta para ver métricas de stock
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
