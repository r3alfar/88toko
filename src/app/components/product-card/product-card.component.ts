import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Produk } from 'src/app/models/produk.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() item: Produk;

  @Output() clicked = new EventEmitter();
}
