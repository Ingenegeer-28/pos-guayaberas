import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-detail-dialog',
  template: `
    <h2 mat-dialog-title>Detalle de Venta #{{data.id_venta}}</h2>
    <mat-dialog-content>
      <div class="info-grid">
        <p><strong>Fecha:</strong> {{data.fecha_venta | date:'medium'}}</p>
        <p><strong>Método:</strong> {{data.metodo_pago | uppercase}}</p>
        <p><strong>Vendedor:</strong> {{data.vendedor}}</p>
      </div>

      <table class="detail-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data.productos">
            <td>{{item.nombre}}</td>
            <td>{{item.cantidad}}</td>
            <td>{{item.precio_unitario | currency}}</td>
            <td>{{(item.cantidad * item.precio_unitario) | currency}}</td>
          </tr>
        </tbody>
      </table>

      <div class="summary-box">
        <p>Subtotal: {{data.subtotal | currency}}</p>
        <p>Descuento: -{{data.descuento_global | currency}}</p>
        <p>Impuestos: {{data.impuestos | currency}}</p>
        <h3 class="total">Total: {{data.total_final | currency}}</h3>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>CERRAR</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .detail-table th { text-align: left; border-bottom: 2px solid #eee; padding: 8px; }
    .detail-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .summary-box { text-align: right; margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px; }
    .total { color: #2e7d32; margin: 0; }
  `]
})
export class SaleDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}