// src/app/modules/admin/components/user-list/user-list.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'username', 'rol', 'estatus', 'fecha_creacion', 'actions'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog, // Usaremos MatDialog para el formulario
    public authService: AuthService // 🚨 MODIFICACIÓN CLAVE: hacerlo público
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(response => {
      if (response.success && response.data) {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        console.error('Error al cargar usuarios:', response.message);
        // Manejar error (ej. mostrar un snackbar)
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserForm(user?: User): void {
    // Abrir el formulario de usuario en un modal (UserFormComponent)
    // Asume que ya tienes un componente llamado UserFormComponent
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: user // Pasar los datos del usuario si es edición, o null si es creación
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Recargar la lista después de crear o editar
      }
    });
  }
  
  deleteUser(user: User): void {
    if (confirm(`¿Está seguro de que desea eliminar a ${user.nombre}?`)) {
      if (user.id_usuario) {
        this.userService.deleteUser(user.id_usuario).subscribe(response => {
          if (response.success) {
            alert('Usuario eliminado correctamente.');
            this.loadUsers(); // Recargar la lista
          } else {
            console.error('Error al eliminar:', response.message);
            alert(`Error al eliminar: ${response.message}`);
          }
        });
      }
    }
  }
}