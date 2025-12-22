// src/app/modules/pos/components/sale-confirmation-dialog/sale-confirmation-dialog.component.ts

import { Component, Inject, HostListener } from '@angular/core'; // 👈 Importar HostListener
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-confirmation-dialog',
  template: `
    <h2 mat-dialog-title class="text-center">¡Venta Exitosa!</h2>
    
    <mat-dialog-content class="text-center">
      <div class="success-icon">
         <mat-icon color="primary">check_circle</mat-icon>
      </div>
      <p class="folio-text">Folio: <strong>#{{ data.folio }}</strong></p>
      <p>¿Desea imprimir el comprobante?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="center">
      <button mat-button (click)="onNoClick()">
        <span class="key-hint">ESC</span> SALIR
      </button>
      
      <button mat-raised-button color="primary" (click)="onPrintClick()" cdkFocusInitial>
        <mat-icon>print</mat-icon> 
        <span class="key-hint white">ENTER</span> IMPRIMIR
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .text-center { text-align: center; }
    .success-icon mat-icon { font-size: 60px; width: 60px; height: 60px; margin-bottom: 10px; }
    .folio-text { font-size: 1.2rem; margin: 10px 0; }
    
    /* Estilo para los indicadores de teclado */
    .key-hint {
      font-size: 10px;
      background: #eee;
      padding: 2px 4px;
      border-radius: 4px;
      border: 1px solid #ccc;
      margin-right: 8px;
      color: #666;
    }
    .key-hint.white {
      background: rgba(255,255,255,0.2);
      border-color: #fff;
      color: #fff;
    }
  `]
})
export class SaleConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaleConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { folio: number }
  ) {}

  // ⌨️ Escuchamos las teclas globalmente mientras el diálogo esté abierto
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onPrintClick();
    } else if (event.key === 'Escape') {
      this.onNoClick();
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onPrintClick(): void {
    this.dialogRef.close(true);
  }
}