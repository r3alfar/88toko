import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {

  @Input() item: CartItem;
  @Output() increase = new EventEmitter();
  @Output() decrease = new EventEmitter();

  constructor() {
    this.item = {
      key: "prd0001",
      nama: 'Aqua Galon',
      harga: 17000,
      imageThumb: 'https://images.tokopedia.net/img/cache/900/attachment/2019/11/28/157492846484392/157492846484392_afe6b81e-e643-4aae-bf65-1429b5f0c373.png',
      qty: 1,
    };
  }
}
