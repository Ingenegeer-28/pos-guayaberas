import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {
  Cliente,
  CustomerService,
} from 'src/app/core/services/customer.service';
import { CustomerFormDialogComponent } from 'src/app/modules/sales/components/customer-form-dialog/customer-form-dialog.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
})
export class ClientListComponent implements OnInit {
  loading = false;
  errorBack: boolean = false;
  isMovil: boolean = false;
  filterCliente: string = '';
  clients: Cliente[] = [];
  modelClientSource: Cliente[] = [];
  clientsToDisplay: Cliente[] = [];
  // Fuente de datos mejorada
  dataSource = new MatTableDataSource<any>([]);
  // displayedColumns: string[] = ['id', 'fecha', 'vendedor', 'metodo', 'total', 'estatus', 'acciones'];

  columnasEscritorio = [
    'id',
    'nombre',
    'telefono',
    'direccion',
    'estatus',
    'acciones',
  ];
  isEditMode: boolean = false;
  columnasMovil = ['id', 'nombre', 'acciones']; // Solo lo vital
  displayedColumns: string[] = this.columnasEscritorio;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private customerService: CustomerService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMovil = result.matches;
        this.displayedColumns = result.matches
          ? this.columnasMovil
          : this.columnasEscritorio;
      });

    this.loadClients();
  }

  loadClients() {
    const filters = {};
    this.loading = true;
    this.customerService.getClients().subscribe({
      next: (res) => {
        if (res.success) {
          this.clientsToDisplay = res.data;
          this.clients = res.data;
          this.dataSource.data = res.data;
          this.dataSource.paginator = this.paginator;
        }
        this.loading = false;
        this.errorBack = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorBack = true;
        console.error('Error al cargar y agrupar modelos:', err);
        // Mostrar un mensaje de error o una alerta al usuario
      },
    });
  }
  applyFilters(): void {
    let filtered = this.clients;

    // Aplicación de todos los filtros seleccionados
    if (this.filterCliente) {
      filtered = filtered.filter((p) => {
        // p.nombre === this.filterCliente || p.telefono === this.filterCliente;
        if (
          p.nombre.toLowerCase().includes(this.filterCliente) ||
          p.telefono?.toLowerCase().includes(this.filterCliente) ||
          p.direccion?.toLowerCase().includes(this.filterCliente)
        ) {
          return true;
        } else {
          return false;
        }
      });
    }

    this.clientsToDisplay = filtered;
  }
  openNewCustomerModal(client?: Cliente) {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '450px',
      disableClose: true,
      data: client,
    });
    dialogRef.afterClosed().subscribe((nuevoCliente) => {
      if (nuevoCliente) {
        this.loadClients(); // Recargar la lista
      }
    });
  }
  deleteUser(client: Cliente): void {
    if (confirm(`¿Está seguro de que desea eliminar a ${client.nombre}?`)) {
      if (client.id_cliente) {
        this.customerService
          .deleteCustomer(client.id_cliente)
          .subscribe((response) => {
            if (response.success) {
              this.snackBar.open(
                `Cliente ${client.nombre} Eliminado Correctamente`,
                'OK',
                {
                  duration: 2000,
                }
              );
              this.loadClients(); // Recargar la lista
            } else {
              this.snackBar.open(
                `Cliente ${client.nombre} No Eliminado`,
                'Cerrar',
                {
                  duration: 2000,
                }
              );
              console.error('Error al eliminar:', response.message);
            }
          });
      }
    }
  }
  clearFilters() {
    this.filterCliente = '';
    this.loadClients();
  }
}
