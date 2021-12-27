import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { CartItem } from 'src/app/models/cart.model';
import { Favorites } from 'src/app/models/favorites.model';
import { Produk } from 'src/app/models/produk.model';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProdukService } from 'src/app/services/produk.service';
import { ProfilService } from 'src/app/services/profil.service';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {

  profile: Profile;
  userID: string;
  products: Produk[];
  favList: Favorites[];

  constructor(
    private profileServ: ProfilService,
    private authServ: AuthService,
    private produkService: ProdukService,
    private cartService: CartService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadFav();
    this.loadAllProduk();
  }

  loadFav() {
    this.authServ.userDetails().subscribe(res => {
      if (res === null) {
        this.profile = undefined;
        this.userID = null;
      }
      else {
        this.profileServ.getFavorites(this.authServ.getuid()).snapshotChanges().pipe(
          map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
        ).subscribe(data => {
          this.favList = data;
        });
      }
    });
  }

  loadAllProduk() {
    this.produkService.getAllProduk().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.products = data;
    });
  }

  findItem(produkId: string) {
    const prod = this.products.find(prod => { return prod.key === produkId });
    return prod;
  }

  unfavItem(favKey: string) {
    this.produkService.unsetFavitem(this.authServ.getuid(), favKey);
  }

  addItemToCart(produkId: string) {
    const prod = this.findItem(produkId);

    const iniItem: CartItem = {
      key: prod.key,
      nama: prod.nama,
      harga: parseInt(prod.harga),
      imageThumb: prod.thumb,
      qty: 1,
    };

    this.cartService.addToCart(iniItem);
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Product added to the cart',
      duration: 1000,
      position: 'top',
      color: 'success'
    });

    toast.present();
  }

}
