import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../core/models/product.model'; // Asegúrate de tener la ruta correcta

@Pipe({
  name: 'filterProducts' // 👈 El nombre debe coincidir con el del template
})
export class FilterPipe implements PipeTransform {

  transform(items: Product[] | null, searchText: string): Product[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Filtrar por nombre, SKU o color (el mismo código de tu método)
      return item.nombre.toLowerCase().includes(searchText) ||
             item.sku.toLowerCase().includes(searchText) ||
             item.color_descripcion.toLowerCase().includes(searchText);
    });
  }
}