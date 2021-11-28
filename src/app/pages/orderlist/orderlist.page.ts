import { Component, OnInit } from '@angular/core';
import { Orderan } from 'src/app/models/orders.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { OrderlistService } from 'src/app/services/orderlist.service';
import { map } from 'rxjs/operators';
import { Produk } from 'src/app/models/produk.model';
import { ProdukService } from 'src/app/services/produk.service';
import { ModalController } from '@ionic/angular';
import { OrderModalComponent } from 'src/app/components/order-modal/order-modal.component';
import { ProfilService } from 'src/app/services/profil.service';
import { Profile } from 'src/app/models/profile.model';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.page.html',
  styleUrls: ['./orderlist.page.scss'],
})
export class OrderlistPage implements OnInit {

  orderList: Orderan[];
  products: Produk[] = [];
  profile: Profile;

  constructor(
    private authServ: AuthService,
    private orderlistServ: OrderlistService,
    private produkService: ProdukService,
    private modalCtrl: ModalController,
    private profileServ: ProfilService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.profileServ.getProfile(this.authService.getuid().toString()).valueChanges()
      .subscribe(data => {
        this.profile = data;
        // console.log(this.profile);
        if (this.profile.isadmin === "admin") this.loadOrderForAdmin();
        else this.loadOrderList();
      });


  }

  loadOrderForAdmin() {
    this.orderlistServ.getAdminViewTransaction().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.orderList = data.reverse();
      for (let i = 0; i < this.orderList.length; i++) {
        this.orderList[i].orderLength = Object.keys(this.orderList[i].productsOrdered).length;
      }
      this.loadAllProduk();
      console.log("YOU ARE ADMIN")
    })
  }

  loadOrderList() {
    this.orderlistServ.getAllTransaction(this.authServ.getuid()).snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.orderList = data.reverse();
      for (let i = 0; i < this.orderList.length; i++) {
        this.orderList[i].orderLength = Object.keys(this.orderList[i].productsOrdered).length;
      }
      this.loadAllProduk();
    });
  }

  loadAllProduk() {
    this.produkService.getAllProduk().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.products = data;

    });
  }

  //buat nested objects
  getKeys(obj) {
    return Object.keys(obj);
  }

  findItem(produkId: string) {
    const prod = this.products.find(prod => { return prod.key === produkId });
    return prod;
  }

  getTanggal(str) {
    const datePurchased = new Date(str);
    const day = datePurchased.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sept", "Okt", "Nov", "Des"];
    const bulan = months[datePurchased.getMonth()];
    const tahun = datePurchased.getFullYear();

    const tanggalBeli = day + ' ' + bulan + ' ' + tahun;
    return tanggalBeli;
  }

  async openModal(orderan) {
    const modal = await this.modalCtrl.create({
      component: OrderModalComponent,
      componentProps: { orderModal: orderan }
    });

    await modal.present();
  }

  parseInteger(value: any) {
    return parseInt(value);
  }

}
