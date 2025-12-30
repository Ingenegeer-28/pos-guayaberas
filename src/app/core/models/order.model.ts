export interface Root {
  success: boolean;
  data: Pedido[];
}
export interface Pedido {
  id_pedido: number;
  id_cliente: number;
  id_usuario: number;
  total_orden: number;
  total_pagado: number;
  subtotal: number;
  descuento_global: number;
  impuestos: number;
  envio: number;
  saldo_pendiente: number;
  estado_fabricacion: string;
  estado_pago: string;
  fecha_entrega_estimada: string;
  fecha_creacion: string;
  cliente_nombre: string;
  cliente_tel: string;
  resumen_items: string;
  items: Item[];
  abonos: Abono[];
}

export interface Item {
  id_detalle_pedido: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: string;
  descuento_item: string;
  nombre: string;
}

export interface Abono {
  id_abono: number;
  id_pedido: number;
  monto: string;
  metodo_pago: string;
  fecha_pago: string;
}
