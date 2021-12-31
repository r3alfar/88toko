import { AfterContentChecked, Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { CartItem } from 'src/app/models/cart.model';
import { Category } from 'src/app/models/category.model';
import { Produk } from 'src/app/models/produk.model';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProdukService } from 'src/app/services/produk.service';
import { ProfilService } from 'src/app/services/profil.service';
import { RekomendasiService } from 'src/app/services/rekomendasi.service';

import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination } from 'swiper/core';

SwiperCore.use([Pagination]);

const sastrawi = require('sastrawijs');
//const sw = require('stopword');
var stemmer = new sastrawi.Stemmer();
var tokenizer = new sastrawi.Tokenizer();
import * as sw from 'stopword';
import { BehaviorSubject, Observable } from 'rxjs';
import { EdititemModalComponent } from 'src/app/components/edititem-modal/edititem-modal.component';
//natural
//const tfidff = require('natural/lib/natural/tfidf');
// import * as natural from 'natural';
// var tfidf = new TfIdf();


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, AfterContentChecked {

  @ViewChild('swiperProduct') swiperProduct: SwiperComponent;
  @ViewChild('swiperThumbnail') swiperThumbnail: SwiperComponent;

  configProduct: SwiperOptions = {
    slidesPerView: 2.6,
    spaceBetween: 10,
  };
  configThumbnail: SwiperOptions = {
    slidesPerView: 1,
    pagination: true,
  };

  produkKey: any;
  produkId: any;
  produk: Produk;
  products: Produk[];
  profile: Profile;
  productsRecommendation: Produk[];
  catList: Category[];
  subcatList: Category[];
  actualKey: any;
  userID: string;
  //subcat: SubCategory[];
  totalAmount$: Observable<number>;

  slideOpts1 = {
    slidesPerView: 2.5,
  };

  isAddProduct: boolean;
  jumlahQty: number;
  // newJumlahQty: number;
  newJumlahQty: number;
  itemInCart: number;
  selectedItemQty$: Observable<any>;
  cartItem$: Observable<CartItem[]>;

  @Input() item: CartItem;
  @Output() increase = new EventEmitter();
  @Output() decrease = new EventEmitter();

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private profileServ: ProfilService,
    private produkService: ProdukService,
    private categoryService: CategoryService,
    private rekomendasiServ: RekomendasiService,
    private cartService: CartService,
    private authServ: AuthService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    //this.produkKey = this.activatedRoute.snapshot.paramMap.get('produk.key');
    //Extras State this
    // this.activatedRoute.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.produkKey = this.router.getCurrentNavigation().extras.state.produkKey;
    //   }
    // });

  }

  ngAfterContentChecked() {
    if (this.swiperProduct) {
      this.swiperProduct.updateSwiper({});
    }
    if (this.swiperThumbnail) {
      this.swiperThumbnail.updateSwiper({});
    }
  }

  ngOnInit() {
    this.loaduser();

    //this.jumlahQty = 1;
    //this.newJumlahQty = 1;
    //this.newJumlahQty = this.cartService.getQty();
    //this.itemInCart = this.cartService.getTotalQty();
    // this.cartItem$ = this.cartService.getCart();

    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      if (!paramMap.has('key')) {
        this.navCtrl.back();
        return;
      }
      this.actualKey = paramMap.get('key');
      //console.log(this.actualKey);
    });

    //const actualKey = this.produkKey.toString();
    this.produkService.getProduk(this.actualKey).valueChanges()
      .subscribe(data => {
        this.produk = data;
        this.loadAllProduk();
      });


    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.catList = data;
    });

  }

  ionViewDidEnter() {
    this.itemInCart = this.cartService.getTotalQty();
    this.newJumlahQty = this.cartService.getQty(this.actualKey);
    if (this.newJumlahQty > 1) this.isAddProduct = true;
    else this.isAddProduct = false;
    //console.log("iviewdidenter: " + this.newJumlahQty)
  }

  loadItemQty(id?: string) {
    return new Promise<void>((resolve) => {
      if (this.actualKey) {
        this.newJumlahQty = this.cartService.getQty(this.actualKey);
      }
      resolve();
    });
  }

  findCategory(catId: string) {
    return {
      ...this.catList.find((cat) => {
        return cat.key === catId;
      })
    };
  }

  loadAllProduk() {
    this.produkService.getAllProduk().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.products = data;
      this.productsRecommendation = this.rekomendasiServ.getRecommendation(this.products, this.actualKey.toString());
      this.productsRecommendation.shift();
      console.log(this.productsRecommendation);
    });
  }

  loaduser() {
    this.authServ.userDetails().subscribe(res => {
      if (res === null) {
        this.profile = undefined;
        this.userID = null;
      }
      else {
        this.profileServ.getProfile(this.authServ.getuid().toString()).valueChanges()
          .subscribe(data => {
            this.profile = data;
            this.userID = this.profile.key;
            // console.log(this.profile.isadmin);
          });
      }
      this.isAddProduct = false;
    });
  }

  // addItemToCart() {
  //   const cartItem: CartItem = {
  //     key: this.actualKey,
  //     nama: this.produk.nama,
  //     harga: parseInt(this.produk.harga),
  //     imageThumb: this.produk.thumb,
  //     qty: 1,
  //   };

  //   this.isAddProduct = true;
  //   console.log(cartItem);
  //   this.cartService.addToCart(cartItem);
  //   this.presentToast();
  // }

  // addItemToCart() {
  //   this.isAddProduct = true;
  //   this.jumlahQty = 1;
  // }

  // onIncrease() {
  //   this.changeQty(1);
  // }

  // onDecrease() {
  //   this.changeQty(-1);
  // }

  // changeQty(quantity: number) {
  //   this.jumlahQty += quantity;
  //   if (this.jumlahQty < 1) {
  //     this.isAddProduct = false;
  //   }
  // }

  // addItemsToCart() {
  //   const cartItem: CartItem = {
  //     key: this.actualKey,
  //     nama: this.produk.nama,
  //     harga: parseInt(this.produk.harga),
  //     imageThumb: this.produk.thumb,
  //     qty: this.jumlahQty,
  //   };
  //   this.cartService.addToCart(cartItem);
  //   this.presentToast();
  // }

  // loadItemInCart(){
  //   this.cartService.getTotalQty().
  // }

  newGoToKeranjang() {
    this.router.navigateByUrl('/tabs/cart');
  }

  newAddtoCart() {
    const cartItem: CartItem = {
      key: this.actualKey,
      nama: this.produk.nama,
      harga: parseInt(this.produk.harga),
      imageThumb: this.produk.thumb,
      qty: 1
    };
    this.cartService.addToCart(cartItem);
    this.newJumlahQty = 1;
    this.itemInCart = this.cartService.getTotalQty();
    this.isAddProduct = true;
  }

  newOnIncrease(produkId: string) {
    //this.changeQty(1);
    this.cartService.changeQty(1, produkId);
    this.newJumlahQty = this.cartService.getQty(produkId);
    this.itemInCart = this.cartService.getTotalQty();
  }

  newOnDecrease(produkId: string) {

    if (this.newJumlahQty === 1) {
      this.cartService.removeItem(produkId);
      this.isAddProduct = false;
    }
    else {
      this.cartService.changeQty(-1, produkId);
      this.newJumlahQty = this.cartService.getQty(produkId);
    }

    this.itemInCart = this.cartService.getTotalQty();
    // this.cartService.changeQty(-1, produkId);
    // this.newJumlahQty = this.cartService.getQty(produkId);
  }

  async removeFromCart(produkId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Remove',
      message: 'Are you sure want to remove?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.cartService.removeItem(produkId)
        },
        {
          text: 'No'
        }
      ]
    });
    alert.present();
  }


  buyNow() {
    const cartItem: CartItem = {
      key: this.actualKey,
      nama: this.produk.nama,
      harga: parseInt(this.produk.harga),
      imageThumb: this.produk.thumb,
      qty: 1,
    };

    console.log(cartItem);
    this.cartService.addToCart(cartItem);
    this.router.navigateByUrl('/tabs/cart');
  }

  favItem(prodId: string) {
    this.produkService.setFavItem(this.authServ.getuid(), prodId);
  }

  unfavItem(prodKey: string, fav: any[]) {
    this.produkService.unsetFavitem(this.authServ.getuid(), this.getProductKey(fav, prodKey));
  }

  getProductKey(item: any, prodid: string) {
    if (item) {
      for (let [key, value] of Object.entries(item)) {
        if (Object.values(value)[0] === prodid) {
          return key;
        }
      }
    }
  }

  isFavOrUnfav(item: any[], prodId: string) {
    if (item) {
      if (Object.values(item).find(i => i.favitemId === prodId)) return true;
    }
    return false;
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Product added to the cart',
      duration: 1000,
      position: 'middle',
      color: 'success'
    });

    toast.present();
  }

  async openModal(actualKey) {
    const modal = await this.modalCtrl.create({
      component: EdititemModalComponent,
      componentProps: { productKey: actualKey }
    });

    await modal.present();
  }

}
