import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { timeStamp } from 'console';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItem$: Observable<CartItem[]>;
  totalAmount$: Observable<number>;
  constructor(
    private authServ: AuthService,
    private alertCtrl: AlertController,
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.cartItem$ = this.cartService.getCart();
    this.totalAmount$ = this.cartService.getTotalAmount();
  }

  onIncrease(item: CartItem) {
    this.cartService.changeQty(1, item.key);
  }

  onDecrease(item: CartItem) {
    if (item.qty === 1) this.removeFromCart(item);
    else this.cartService.changeQty(-1, item.key);
  }

  async removeFromCart(item: CartItem) {
    const alert = await this.alertCtrl.create({
      header: 'Remove',
      message: 'Are you sure want to remove?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.cartService.removeItem(item.key)
        },
        {
          text: 'No'
        }
      ]
    });
    alert.present();
  }

  submitOrder() {
    this.cartService.addOrder(this.authServ.getuid());

  }
}
