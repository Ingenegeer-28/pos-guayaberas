import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProductSelectorComponent } from '../../components/product-selector/product-selector.component';

@Component({
  selector: 'app-pos-page',
  templateUrl: './pos-page.component.html',
  styleUrls: ['./pos-page.component.css']
})
export class PosPageComponent {

  // @Output() reloadPos = new EventEmitter();
   @ViewChild(ProductSelectorComponent) productSelectorPos!: ProductSelectorComponent;
  finishTranx(mensaje: string) {
    // this.child.carta = this.colValue;
    console.log('finished models' + mensaje);
    // this.reloadPos.emit();
    this.productSelectorPos.goBackToModels();
  }
}
