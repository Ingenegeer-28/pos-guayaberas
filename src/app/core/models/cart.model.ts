import { Product } from './product.model'; // Importamos la interfaz Product ya definida

// Representa un ítem dentro del carrito
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  itemDiscount?: number;
  itemNetTotal?: number;
}

// Representa el estado total del carrito
export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  rawSubtotal: number; // Nuevo: Subtotal antes de CUALQUIER descuento
  netSubtotal: number; // Nuevo: Subtotal después de DESCUENTOS POR ÍTEM
  tax: number;
  totalDiscount: number; // Nuevo: Descuento total aplicado
  shippingCost: number; // Nuevo: Costo de envío
  finalTotal: number;
}

export interface CartTotals {
  itemsSubtotal: number; // Suma de (precio * cantidad) de todos los ítems
  totalDiscount: number; // Descuento aplicado al total del carrito
  shippingCost: number; // Costo de envío
  finalTotal: number; // Total final a pagar
}
