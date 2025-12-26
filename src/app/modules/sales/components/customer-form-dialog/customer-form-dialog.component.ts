import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerService, Cliente } from 'src/app/core/services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-form-dialog',
  templateUrl: './customer-form-dialog.component.html'
})
export class CustomerFormDialogComponent {
  nuevoCliente: Cliente = {
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  };
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<CustomerFormDialogComponent>,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {}

  guardar() {
    if (!this.nuevoCliente.nombre) return;

    this.loading = true;
    this.customerService.createCustomer(this.nuevoCliente).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Cliente registrado', 'Cerrar', { duration: 2000 });
          // Devolvemos el cliente con el ID generado por el backend
          this.dialogRef.close({ ...this.nuevoCliente, id_cliente: res.id_cliente });
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al registrar cliente', 'Cerrar');
      }
    });
  }
}