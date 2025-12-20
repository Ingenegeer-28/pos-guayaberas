// src/app/core/models/sale.model.ts

export interface SaleItemRequest {
  id_producto: string;
  cantidad: number;
  precio: string; // Precio unitario al momento de la venta
  itemDiscount?: number;
}

export interface SaleRequest {
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  id_usuario: number;
  subtotal: number;       // rawSubtotal o netSubtotal del CartSummary
  descuento_global: number;
  impuestos: number;
  envio: number;
  total_final: number;
  items: SaleItemRequest[];
}

export interface SaleResponse {
  success: boolean;
  id_venta: number;
  message: string;
}