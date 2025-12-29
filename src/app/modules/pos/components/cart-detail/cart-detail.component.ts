import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { CartItem, CartSummary } from 'src/app/core/models/cart.model';
import { Product } from 'src/app/core/models/product.model';
import { SaleRequest } from 'src/app/core/models/sale.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { PrintService } from 'src/app/core/services/print.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SaleService } from 'src/app/core/services/sale.service';
import { SaleConfirmationDialogComponent } from '../sale-confirmation-dialog/sale-confirmation-dialog.component';
import { OrderDialogComponent } from 'src/app/modules/sales/components/order-dialog/order-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css'],
})
export class CartDetailComponent implements OnInit {
  @Output() finishTrx = new EventEmitter();
  expandedElement!: CartItem | null;
  // El observable del carrito que contiene tanto los ítems como los totales
  cartSummary$: Observable<CartSummary> = this.cartService.cart$;

  // Columnas a mostrar en la tabla (debe coincidir con la actualización HTML)
  // displayedColumns: string[] = ['name', 'quantity', 'price', 'itemDiscount', 'subtotal', 'actions'];
  displayedColumns: string[] = ['name', 'price', 'subtotal'];
  columnsToDisplayWithExpandT = [...this.displayedColumns, 'expand'];

  // 💳 Propiedad para el método de pago (por defecto efectivo)
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' = 'efectivo';
  // Estado de carga para el botón
  isProcessing = false;

  constructor(
    private cartService: CartService,
    private saleService: SaleService, // 👈 Inyectar
    private authService: AuthService, // 👈 Inyectar
    private printService: PrintService,
    private dialog: MatDialog,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Suscripción al estado reactivo del carrito
    this.cartSummary$ = this.cartService.cart$;
  }

  /** Checks whether an element is expanded. */
  isExpanded(element: CartItem) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: CartItem) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }
  // --- Métodos de Acción ---

  updateQuantity(productId: number, newQuantity: number): void {
    // La función updateQuantity ya está definida en el CartService
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeItem(productId: number, item: CartItem): void {
    this.productService.deleteItem(item);
    this.cartService.removeItem(productId);
  }

  applyItemDiscount(productId: number, discount: number): void {
    // Aseguramos la conversión a float para el servicio
    const value = parseFloat(discount as any) || 0;
    this.cartService.applyItemDiscount(productId, value);
  }

  applyTotalDiscount(discount: number): void {
    const value = parseFloat(discount as any) || 0;
    this.cartService.applyTotalDiscount(value);
  }

  setShippingCost(cost: number): void {
    const value = parseFloat(cost as any) || 0;
    this.cartService.setShippingCost(value);
  }
  /**
   * Finaliza la transacción y conecta con el SaleService.
   */
  checkout(): void {
    // 1. Obtener el estado actual del carrito de forma segura (una sola vez)
    this.cartSummary$.pipe(take(1)).subscribe((summary) => {
      if (summary.items.length === 0) return;

      this.isProcessing = true;

      // 2. Preparar el Payload para la API
      // Nota: Aquí podrías abrir un diálogo previo para elegir el método de pago
      const salePayload: SaleRequest = {
        id_usuario: Number(this.authService.getCurrentUser()) || 2, // Obtener del AuthService this.authService.getCurrentUser()?.id || 1
        subtotal: summary.netSubtotal, // Tu [value-4]
        descuento_global: summary.totalDiscount, // Tu [value-5]
        impuestos: summary.tax, // Tu [value-6]
        envio: summary.shippingCost, // Tu [value-7]
        total_final: summary.finalTotal, // Tu [value-8]
        metodo_pago: this.metodoPago, // La columna que agregamos
        items: summary.items.map((item) => ({
          id_producto: item.product.id_producto.toString(),
          cantidad: item.quantity,
          precio: item.product.precio,
          itemDiscount: item.itemDiscount,
        })),
      };

      // 3. Llamar al servicio de ventas
      this.saleService.createSale(salePayload).subscribe({
        next: (response) => {
          this.isProcessing = false;
          if (response.success) {
            const dialogRef = this.dialog.open(
              SaleConfirmationDialogComponent,
              {
                width: '400px',
                disableClose: true, // Obligar al usuario a elegir una opción
                data: { folio: response.id_venta },
              }
            );

            dialogRef.afterClosed().subscribe((shouldPrint) => {
              if (shouldPrint) {
                // 🖨️ Solo imprimimos si el usuario hizo clic en "Imprimir"
                this.printService.printTicket(salePayload, response.id_venta);
              }

              // ✅ En ambos casos, limpiamos el carrito al terminar
              this.cartService.clearCart();
              // this.snackBar.open('Venta finalizada', 'OK', { duration: 2000 });
              // this.snackBar.open('Venta exitosa e imprimiendo...', 'Cerrar', { duration: 3000 });
              this.snackBar.open('✅ Venta registrada: ' + this.metodoPago.toUpperCase(), 'Cerrar', { duration: 3000 });
              // this.cartService.clearCart();
              this.metodoPago = 'efectivo'; // Resetear a default
            });
            this.productService.loadGroupedModelos();
            this.finishedTrax();
          }
        },
        error: (err) => {
          this.isProcessing = false;
          console.error('Error al realizar venta:', err);
          this.snackBar.open('❌ Error al procesar la venta. Revisa el inventario.', 'Cerrar', {
            panelClass: ['error-snackbar'],
            duration: 5000
          });
        },
      });
    });
  }
  abrirModalPedido(): void {
    this.cartSummary$.pipe(take(1)).subscribe((summary) => {
      if (summary.items.length === 0) return;

      const dialogRef = this.dialog.open(OrderDialogComponent, {
        width: '600px',
        disableClose: true,
        data: summary
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si el pedido se guardó con éxito en el modal, limpiamos el carrito
          this.cartService.clearCart();
          this.productService.loadGroupedModelos(); // Refrescar stock visual
          this.finishedTrax();
        }
      });
    });
  }
  clearCart(): void {
    const items = this.cartService.getAllItemsSync();
    this.productService.restartModels(items);
    this.cartService.clearCart();
  }
  finishedTrax():void{
    this.finishTrx.emit('hola desde el hijo');
  }
}
