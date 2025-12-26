import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderPaymentDialogComponent } from '../order-payment-dialog/order-payment-dialog.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  errorBack: boolean = false;
  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorBack = true;
        console.error('Error al cargar y agrupar modelos:', err);
        // Mostrar un mensaje de error o una alerta al usuario
      }
    });
  }

  // Filtrado por estado para las pestañas
  get ordersInProduction() {
    return this.orders.filter(o => o.estado_fabricacion !== 'listo' && o.estado_fabricacion !== 'entregado');
  }

  get ordersReady() {
    return this.orders.filter(o => o.estado_fabricacion === 'listo');
  }

  updateStatus(id: number, status: string) {
    this.orderService.updateFabricationStatus(id, status).subscribe(() => {
      this.snackBar.open(`Pedido actualizado a: ${status}`, 'OK', { duration: 2000 });
      this.fetchOrders();
    });
  }

  collectBalance(order: any) {
    const dialogRef = this.dialog.open(OrderPaymentDialogComponent, {
      width: '450px',
      data: order,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchOrders(); // Refrescar la lista para ver el cambio de estado
      }
    });
  }
}