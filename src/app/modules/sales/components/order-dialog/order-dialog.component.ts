import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, switchMap, finalize, filter } from 'rxjs/operators';

// Servicios y Modelos
import {
  CustomerService,
  Cliente,
} from 'src/app/core/services/customer.service';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerFormDialogComponent } from '../customer-form-dialog/customer-form-dialog.component';
import { PrintService } from 'src/app/core/services/print.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css'],
})
export class OrderDialogComponent implements OnInit {
  // Control para el buscador de clientes
  customerControl = new FormControl();
  filteredCustomers: Cliente[] = [];
  isLoading = false;
  selectedCustomer: Cliente | null = null;

  // Variables para la gestión del pedido
  fechaEntrega: Date | null = null;
  montoAbono: number = 0;
  metodoPago: string = 'efectivo';
  isSaving = false;

  constructor(
    private customerService: CustomerService,
    private orderService: OrderService,
    private authService: AuthService,
    private printService: PrintService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe { items, total } desde el carrito
  ) {
    console.log(data);
  }

  ngOnInit() {
    // Lógica reactiva para el autocompletado de clientes
    this.customerControl.valueChanges
      .pipe(
        filter((value) => typeof value === 'string' && value.length > 2), // Buscar tras 3 caracteres
        debounceTime(300), // Esperar que el usuario deje de escribir
        switchMap((value) => {
          this.isLoading = true;
          return this.customerService
            .searchCustomers(value)
            .pipe(finalize(() => (this.isLoading = false)));
        })
      )
      .subscribe((res) => {
        this.filteredCustomers = res.data;
      });
  }

  /**
   * Abre el modal pequeño para registrar un cliente nuevo
   */
  openNewCustomerModal() {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, {
      width: '350px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((nuevoCliente) => {
      if (nuevoCliente) {
        this.selectedCustomer = nuevoCliente;
        this.customerControl.setValue(nuevoCliente);
        this.snackBar.open(`Cliente ${nuevoCliente.nombre} registrado`, 'OK', {
          duration: 2000,
        });
      }
    });
  }

  /**
   * Procesa y guarda el pedido en la base de datos
   */
  crearPedido() {
    // if (!this.selectedCustomer || !this.fechaEntrega || this.montoAbono < 0) {
    if (!this.selectedCustomer || !this.fechaEntrega) {
      this.snackBar.open('Complete todos los campos obligatorios', 'Cerrar');
      return;
    }

    this.isSaving = true;

    // Estructura del pedido para el backend
    const pedidoPayload = {
      id_cliente: this.selectedCustomer.id_cliente,
      cliente_nombre: this.selectedCustomer.nombre,
      // id_usuario: this.authService.getCurrentUser()?.id || 2, // ID del vendedor actual
      id_usuario: 2, // ID del vendedor actual
      total_orden: this.data.finalTotal,
      total_pagado: this.montoAbono,
      metodo_pago: this.metodoPago,
      impuestos: this.data.tax,
      subtotal: this.data.netSubtotal,
      descuento_global: this.data.totalDiscount,
      envio: this.data.shippingCost,
      fecha_entrega: this.fechaEntrega.toISOString().split('T')[0], // Formato YYYY-MM-DD
      items: this.data.items.map((item: any) => ({
        id_producto: item.product.id_producto,
        nombre: item.product.nombre,
        cantidad: item.quantity,
        precio: item.product.precio,
        itemDiscount: item.itemDiscount || 0,
      })),
    };
    console.log(pedidoPayload);
    this.orderService.createOrder(pedidoPayload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.snackBar.open('✅ Pedido guardado correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.printService.printOrderTicket(pedidoPayload, res.id_pedido);
          this.dialogRef.close(true); // Indica éxito al componente padre (CartDetail)
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.snackBar.open('❌ Error al guardar el pedido', 'Cerrar');
        console.error(err);
      },
    });
  }

  
  onCustomerSelected(event: any) {
    this.selectedCustomer = event.option.value;
  }

  displayFn(cliente: Cliente): string {
    return cliente ? `${cliente.nombre} (${cliente.telefono})` : '';
  }
}
