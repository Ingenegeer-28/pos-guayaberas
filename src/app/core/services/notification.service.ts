import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly URL = `${environment.url_base}/notifications`;

  constructor(private http: HttpClient) { }


  /**
   * Envía notificación de WhatsApp con resumen de cuenta
   */
  sendOrderReadyMessage(order: any): void {
    const cleanPhone = order.cliente_tel.replace(/\D/g, '');
    const lada = '521'; // Ajusta según tu país
    const finalPhone = cleanPhone.startsWith('52') ? cleanPhone : lada + cleanPhone;

    // Formateador de moneda para que los números se vean bien ($1,200.00)
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

    const total = formatter.format(order.total_orden);
    const abonado = formatter.format(order.total_pagado);
    const saldo = order.total_orden - order.total_pagado;

    // Construcción del mensaje con formato de WhatsApp
    let message = `¡Hola *${order.cliente_nombre}*! ✨\n\n`;
    message += `Te informamos que tu pedido *#ORD-${order.id_pedido}* ya está listo para entrega. 🧵🛒\n\n`;
    message += `*RESUMEN DE CUENTA:*\n`;
    message += `--------------------------\n`;
    message += `Total pedido: ${total}\n`;
    message += `Total abonado: ${abonado}\n`;

    // Solo agregar saldo pendiente si es mayor a 0
    if (saldo > 0) {
      message += `*SALDO PENDIENTE: ${formatter.format(saldo)}*\n`;
      message += `--------------------------\n`;
      message += `_Recuerda liquidar al recoger tu prenda._\n\n`;
    } else {
      message += `--------------------------\n`;
      message += `*CUENTA TOTALMENTE PAGADA* ✅\n\n`;
    }
    message += `¡Te esperamos en la tienda! 🏪\n\n`;
    message += `¡Recuerda compartir tus datos si es por envío! 🚚📦`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodedMessage}`;
    
    window.open(url, '_blank');
  }

  /**
   * Envía un mensaje de WhatsApp a través del Backend
   * @param phone Teléfono con código de país (ej: 5219991234567)
   * @param message Texto del mensaje
   */
  sendWhatsApp(phone: string, message: string): Observable<any> {
    return this.http.post(`${this.URL}/whatsapp.php`, {
      phone: phone,
      message: message
    });
  }

  /**
   * Notificación automática de "Pedido Listo"
   */
  notifyOrderReady(order: any): Observable<any> {
    const message = `¡Hola ${order.cliente_nombre}! ✨ Tu guayabera del pedido #ORD-${order.id_pedido} ya está lista para entrega. Puedes pasar por ella a la tienda.`;
    return this.sendWhatsApp(order.telefono, message);
  }
}