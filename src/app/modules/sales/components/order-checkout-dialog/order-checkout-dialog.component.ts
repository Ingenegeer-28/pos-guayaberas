import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-checkout-dialog',
  templateUrl: './order-checkout-dialog.component.html',
  styleUrls: ['./order-checkout-dialog.component.css']
})

export class OrderCheckoutDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
