import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [RoleGuard],
    data: { title: 'Gestión de Usuarios', roles: ['admin'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
