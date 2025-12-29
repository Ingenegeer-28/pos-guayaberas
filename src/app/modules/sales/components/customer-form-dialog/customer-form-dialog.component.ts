import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService, Cliente } from 'src/app/core/services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-form-dialog',
  templateUrl: './customer-form-dialog.component.html'
})
export class CustomerFormDialogComponent implements OnInit {
  nuevoCliente: Cliente = {
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    estatus : true
  };
  textButton: string = 'GUARDAR Y SELECCIONAR';
  loading = false;
  isEditMode: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<CustomerFormDialogComponent>,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Cliente | null // Recibe datos si es edición
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    if(this.isEditMode){
      this.nuevoCliente.id_cliente = this.data?.id_cliente
      this.nuevoCliente.nombre = this.data?.nombre || '';
      this.nuevoCliente.direccion = this.data?.direccion
      this.nuevoCliente.telefono = this.data?.telefono || '';
      this.nuevoCliente.rfc = this.data?.rfc;
      this.nuevoCliente.estatus = this.data?.estatus;
      this.textButton = 'ACTUALIZAR';
    }
  }
  guardar() {
    if (!this.nuevoCliente.nombre) return;

    this.loading = true;
    const operation$ = this.isEditMode
      ? this.customerService.updateCustomer(this.nuevoCliente)
      : this.customerService.createCustomer(this.nuevoCliente);

    operation$.subscribe(
      (response) => {
        if (response.success) {
          this.snackBar.open(this.isEditMode ? 'Cliente actualizado.' : 'Cliente creado.', 'Cerrar', { duration: 2000 });
          // Devolvemos el cliente con el ID generado por el backend
          this.dialogRef.close({ ...this.nuevoCliente, id_cliente: response.id_cliente });
        } else {
          this.snackBar.open(this.isEditMode ? 'Error al actualizar el cliente .' : 'Error al registrar el cliente.', 'Cerrar');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.snackBar.open(this.isEditMode ? 'Error al actualizar el cliente .' : 'Error al registrar el cliente.', 'Cerrar');
        console.error('Error HTTP:', error);
      }
    );
  }
}