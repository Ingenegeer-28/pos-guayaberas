// src/app/core/models/sale.model.ts

export interface SaleItemRequest {
  id_producto: string;
  cantidad: number;
  precio: number; // Precio unitario al momento de la venta
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
export interface Root {
  success: boolean
  data: Data
}
export interface Data {
  id_venta: number
  id_usuario: number
  fecha_venta: string
  subtotal: string
  descuento_global: string
  impuestos: string
  envio: string
  total_final: string
  metodo_pago: string
  estatus_venta: string
  vendedor: string
  productos: Producto[]
}

export interface Producto {
  id_detalle: number
  id_venta: number
  id_producto: number
  cantidad: number
  precio_unitario: string
  descuento_item: string
  nombre: string
  modelo: string
}