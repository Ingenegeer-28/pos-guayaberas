import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem, CartSummary } from 'src/app/core/models/cart.model';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css'],
})
export class CartDetailComponent implements OnInit {
  expandedElement!: CartItem | null;

  
  // El observable del carrito que contiene tanto los ítems como los totales
  cartSummary$: Observable<CartSummary> = this.cartService.cart$;
  
  // Columnas a mostrar en la tabla (debe coincidir con la actualización HTML)
  // displayedColumns: string[] = ['name', 'quantity', 'price', 'itemDiscount', 'subtotal', 'actions'];
  displayedColumns: string[] = ['name', 'price', 'subtotal'];
  columnsToDisplayWithExpandT = [...this.displayedColumns, 'expand'];
  
  constructor(private cartService: CartService) {}

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

  removeItem(productId: number): void {
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
   * Finaliza la transacción y limpia el carrito.
   */
  checkout(): void {
    this.cartService.checkout();
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
