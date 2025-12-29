import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/core/services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrintService } from 'src/app/core/services/print.service';

@Component({
  selector: 'app-order-payment-dialog',
  templateUrl: './order-payment-dialog.component.html',
  styleUrls: ['./order-payment-dialog.component.css']
})
export class OrderPaymentDialogComponent {
  montoAPagar: number;
  metodoPago: string = 'efectivo';
  loading: boolean = false;
  liquidado: boolean = false;
  idPedidoGenerado!: number;

  constructor(
    public dialogRef: MatDialogRef<OrderPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibe el objeto 'order'
    private orderService: OrderService,
    private printService: PrintService,
    private snackBar: MatSnackBar
  ) {
    // Por defecto, sugerimos liquidar el saldo pendiente total
    this.montoAPagar = this.data.saldo_pendiente;
    // console.log(data);
  }

  confirmarPago() {
    if (this.montoAPagar <= 0 || this.montoAPagar > this.data.saldo_pendiente) {
      this.snackBar.open('Monto inválido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.orderService.addPayment(this.data.id_pedido, this.montoAPagar, this.metodoPago)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.liquidado) {
            this.liquidado = true; // Activa el botón de impresión en el HTML
            this.idPedidoGenerado = res.id_pedido;
            this.snackBar.open('¡Pedido Liquidado con éxito!', 'OK', { duration: 5000 });
          } else {
            this.snackBar.open('Pago registrado con éxito', 'OK', { duration: 2000 });
          this.dialogRef.close(true);
          }
          
        },
        error: (err) => {
          console.log(err)
          this.loading = false;
          this.snackBar.open('Error al procesar el pago', 'Cerrar');
        }
      });
  }

  imprimirTicket() {
    this.orderService.getOrderById(this.data.id_pedido).subscribe({
      next:( res)=>{
        // console.log(res);
        this.printService.printLiquidationTicket(res.data);
      },
      error:(err) =>{
        console.log(err);
      },
    })
    this.dialogRef.close(true);
  }
}