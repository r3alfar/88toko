import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { timeStamp } from 'console';
import { Profile } from 'src/app/models/profile.model';
import { ProfilService } from 'src/app/services/profil.service';
import { Router } from '@angular/router';
// import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItem$: Observable<CartItem[]>;
  totalAmount$: Observable<number>;
  profile: Profile;
  opsiBayar: string;
  opsiBayarSetting: string;
  constructor(
    private authServ: AuthService,
    private alertCtrl: AlertController,
    private cartService: CartService,
    private profileServ: ProfilService,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.loadUser();
    this.cartItem$ = this.cartService.getCart();
    this.totalAmount$ = this.cartService.getTotalAmount();
  }

  loadUser() {
    this.authServ.userDetails().subscribe(res => {
      if (res === null) {
        this.profile = undefined;
      }
      else {
        this.profileServ.getProfile(this.authServ.getuid().toString()).valueChanges()
          .subscribe(data => {
            this.profile = data;
          });
      }
    });
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

  getPaymentOption(event) {
    this.opsiBayar = event.detail.value;

    if (this.opsiBayar === 'COD') this.opsiBayarSetting = '<br><br>Menyiapkan tunai saat penjual tiba.';
    else if (this.opsiBayar === 'OVO') this.opsiBayarSetting = '<br><br>Transfer ke <br><b>OVO</b> 0821-1467-9526 <br>a/n Sylvia';
    else if (this.opsiBayar === 'GoPay') this.opsiBayarSetting = '<br><br>Transfer ke <br><b>GoPay</b> 0821-1467-9526 <br>a/n Sylvia';
    else if (this.opsiBayar === 'ShopeePay') this.opsiBayarSetting = '<br><br>Transfer ke <br><b>ShopeePay</b> 0821-1467-9526 <br>a/n Sylvia';
    console.log(this.opsiBayar + ': ' + this.opsiBayarSetting);
  }

  async submitOrder() {
    if (this.profile) {

      if (this.opsiBayar === undefined) {
        this.alertOpsiBayar();
      }
      else this.alertCheckout();

    }
    else {
      //Alert user not found
      const alert = await this.alertCtrl.create({
        header: 'User Not Found',
        message: 'Please Login to use this feature!',
        buttons: [
          {
            text: 'Login',
            handler: () => this.navCtrl.navigateForward('a-signin')
          },
          {
            text: 'Lain kali'
          }
        ]
      });
      alert.present();
    }

  }

  async alertCheckout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Transaksi',
      message: 'Untuk melakukan pembayaran dengan metode ' + this.opsiBayar + ' Mohon untuk ' + this.opsiBayarSetting
        + '<br><br> Untuk Konfirmasi/Bantuan hubungi 081808185051',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Proses',
          handler: () => {
            this.cartService.addOrder(this.authServ.getuid(), this.opsiBayar);
            this.openWA();
          }
          //this.cartService.addOrder(this.authServ.getuid(), this.opsiBayar)
        }
      ]
    });
    alert.present();
  }

  async alertOpsiBayar() {
    const alert = await this.alertCtrl.create({
      header: 'Perhatian',
      message: 'Harap masukkan metode pembayaran anda!',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  async openWA() {
    const countrycode = "62";
    const waPenjual = "82208225051";
    const text = "Permisi Pak/Bu, Saya telah melakukan order lewat aplikasi. Harap segera Diproses! Metode Pembayaran: " + this.opsiBayar;
    const urlWA = "https://wa.me/" + countrycode + waPenjual + "?text=" + text;

    const alert = await this.alertCtrl.create({
      header: 'Perhatian',
      message: 'Anda akan diarahkan ke Whatsapp Messenger untuk konfirmasi order ke penjual!',
      buttons: [
        {
          text: 'ok',
          handler: () => {
            console.log(urlWA);
            window.open(encodeURI(urlWA));
          }
        }
      ]
    });
    alert.present();
  }

}
