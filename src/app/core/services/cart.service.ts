import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model'; // Asume esta ruta
import { CartItem, CartSummary } from '../models/cart.model'; // Asume esta ruta
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private readonly TAX_RATE = 0.16; // 16% de IVA (ejemplo en México)

  // Estado inicial del carrito
  private initialSummary: CartSummary = {
    items: [],
    totalItems: 0,
    rawSubtotal: 0, 
    netSubtotal: 0,
    tax: 0,
    totalDiscount: 0, // Inicializar descuento total
    shippingCost: 0,  // Inicializar costo de envío
    finalTotal: 0
  };
  
  // Variables que retienen el estado global
  private currentShippingCost: number = 0;
  private currentTotalDiscount: number = 0;

  // Observable que mantendrá el estado actual del carrito
  private cartSubject = new BehaviorSubject<CartSummary>(this.initialSummary);
  
  // Observable público para que los componentes se suscriban
  public cart$: Observable<CartSummary> = this.cartSubject.asObservable(); 

  constructor(
    private productService: ProductService,
  ) { }

  // --- MÉTODOS DE ACCIÓN ---

  addItem(product: Product, quantity: number = 1): void {
    const currentSummary = this.cartSubject.getValue();
    const items = [...currentSummary.items];

    // Buscar si el producto ya existe en el carrito
    const itemIndex = items.findIndex(i => i.product.id_producto === product.id_producto);

    if (itemIndex > -1) {
      // 1. Si existe, actualizar la cantidad
      const existingItem = items[itemIndex];
      this.productService.addItem(product, existingItem);
      existingItem.quantity += quantity;
      items[itemIndex] = existingItem;
    } else {
      // 2. Si no existe, añadir un nuevo item
      const newItem: CartItem = {
        product: product,
        quantity: quantity,
        itemDiscount: 0, // Nuevo: Inicializar descuento por ítem a cero
        subtotal: 0, // Se recalculará después
        itemNetTotal: 0 // Se recalculará después
      } as CartItem; 
      this.productService.addItem(product, newItem);
      items.push(newItem);
    }
    
    // Recalcular y emitir el nuevo estado
    this.recalculateCart(items);
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const items = [...this.cartSubject.getValue().items];
    const itemIndex = items.findIndex(i => Number(i.product.id_producto) === productId);

    if (itemIndex > -1) {
      const item = items[itemIndex];
      const cantidad =  item.quantity - newQuantity;
      item.quantity = newQuantity;
      this.productService.updateQuantity(item.product, cantidad);
      this.recalculateCart(items);
    }
  }

  removeItem(productId: number | string): void {
    // Usamos string|number porque los IDs de tu JSON son strings
    const items = this.cartSubject.getValue().items.filter(i => Number(i.product.id_producto) != productId);
    this.recalculateCart(items);
  }
  
  // Nuevo: Aplicar descuento a un ítem específico
  applyItemDiscount(productId: number | string, discountValue: number): void {
    const items = [...this.cartSubject.getValue().items];
    const itemIndex = items.findIndex(i => Number(i.product.id_producto) == productId);

    if (itemIndex > -1) {
      items[itemIndex].itemDiscount = discountValue >= 0 ? discountValue : 0;
      this.recalculateCart(items);
    }
  }
  
  // Nuevo: Establecer costo de envío
  setShippingCost(cost: number): void {
      this.currentShippingCost = cost >= 0 ? cost : 0;
      this.recalculateCart(this.cartSubject.getValue().items);
  }

  // Nuevo: Aplicar descuento total
  applyTotalDiscount(discountValue: number): void {
      this.currentTotalDiscount = discountValue >= 0 ? discountValue : 0;
      this.recalculateCart(this.cartSubject.getValue().items);
  }

  // Finaliza la transacción
  checkout(): CartSummary {
    // ... (Lógica de checkout existente)
    const finalSummary = this.cartSubject.getValue();
    console.log('Procesando Venta:', finalSummary);
    this.clearCart();
    return finalSummary;
  }
  public getAllItemsSync(): CartItem[] {
      return this.cartSubject.value.items;
    }
  /**
   * Restablece el carrito a su estado inicial.
   */
  clearCart(): void {
    this.currentShippingCost = 0;
    this.currentTotalDiscount = 0;
    // Emitir el resumen inicial vacío
    this.cartSubject.next({
      items: [],
      totalItems: 0,
      rawSubtotal: 0,
      netSubtotal: 0,
      tax: 0,
      totalDiscount: 0,
      shippingCost: 0,
      finalTotal: 0
    });
  }
  
  // --- MÉTODOS PRIVADOS ---

  private recalculateCart(items: CartItem[]): void {
    let rawSubtotal = 0; // Subtotal sin ningún descuento
    let netSubtotal = 0; // Subtotal después de descuento por ítem
    let totalItems = 0;
    let totalItemDiscount = 0;
    
    items.forEach(item => {
      // 1. Calcular subtotal bruto del ítem
      item.subtotal = item.quantity * Number(item.product.precio);
      
      // 2. Aplicar descuento por ítem
      const discount = Math.min(item.itemDiscount || 0, item.subtotal); // No descontar más que el subtotal
      item.itemNetTotal = item.subtotal - discount;
      
      rawSubtotal += item.subtotal - discount;
      netSubtotal += item.itemNetTotal;
      totalItems += item.quantity;
      totalItemDiscount += discount;
    });
    
    // 3. Aplicar descuento total al carrito (se aplica al subtotal neto)
    const totalDiscount = this.currentTotalDiscount;
    const subtotalAfterTotalDiscount = netSubtotal - totalDiscount;
    
    // 4. Calcular impuestos sobre el subtotal después de todos los descuentos
    const taxableBase = Math.max(0, subtotalAfterTotalDiscount);
    const tax = taxableBase * this.TAX_RATE;
    
    // 5. Calcular Total Final
    const finalTotal = taxableBase + tax + this.currentShippingCost;
    
    // Suma de todos los descuentos (para el campo 'discount' si se requiere)
    const combinedDiscount = totalItemDiscount + totalDiscount; 
    
    // Crear y emitir el nuevo resumen del carrito
    const newSummary: CartSummary = {
      items,
      totalItems,
      rawSubtotal: rawSubtotal,
      netSubtotal: netSubtotal,
      tax: tax,
      totalDiscount: totalDiscount, // Solo el descuento aplicado al total
      shippingCost: this.currentShippingCost,
      finalTotal: Math.max(0, finalTotal) // Asegurar que el total no sea negativo
    };
    
    this.cartSubject.next(newSummary);
  }
}