import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Produk } from 'src/app/models/produk.model';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { OrderlistService } from 'src/app/services/orderlist.service';
import { ProdukService } from 'src/app/services/produk.service';
import { ProfilService } from 'src/app/services/profil.service';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
})
export class OrderModalComponent implements OnInit {
  @Input() orderModal: any;
  products: Produk[];
  profile: Profile;
  profiletemp: Profile;
  pembeliAlamat: string;
  pembeliNama: string;
  pembeliNotelp: string;

  constructor(
    private modalCtrl: ModalController,
    private orderlistServ: OrderlistService,
    private produkService: ProdukService,
    private profileServ: ProfilService,
    private authServ: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }


  ngOnInit() {
    this.loadUser();
    this.loadAllProduk();
    this.loadUserPrivilege(this.orderModal.profileId);


    //console.log(this.orderModal);
  }

  loadAllProduk() {
    this.produkService.getAllProduk().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.products = data;
      //console.log(this.products);
    });
  }

  loadUser() {
    this.profileServ.getProfile(this.authServ.getuid().toString()).valueChanges()
      .subscribe(data => {
        this.profile = data;
      });
  }

  loadUserPrivilege(profId: string) {
    this.profileServ.getProfile(profId).valueChanges()
      .subscribe(data => {
        this.pembeliNama = data.name;
        this.pembeliAlamat = data.alamat;
        this.pembeliNotelp = data.noTelp;
      });
  }

  // findAlamatProfile(profileId: string) {
  //   return this.loadUserPrivilege(profileId);
  // }


  dismissModal() {
    this.modalCtrl.dismiss();
  }

  getTanggal(str) {
    const datePurchased = new Date(str);
    const day = datePurchased.getDate();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const bulan = months[datePurchased.getMonth()];
    const tahun = datePurchased.getFullYear();

    const tanggalBeli = day + ' ' + bulan + ' ' + tahun;
    return tanggalBeli;
  }

  getBulan(str) {
    const datePurchased = new Date(str);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sept", "Okt", "Nov", "Des"];
    const bulan = months[datePurchased.getMonth()];

    return bulan;
  }

  getTgl(str) {
    const datePurchased = new Date(str);
    return datePurchased.getDate();
  }

  getWaktu(str) {
    const date = new Date(str);
    return date.getTime();
  }

  getW4ktu(str) {
    const d = new Date(str);
    const hr = d.getHours();
    const sec = d.getMinutes();

    return hr + ":" + sec;
  }

  findItem(produkId: string) {
    const prod = this.products.find(prod => { return prod.key === produkId });
    return prod;
  }

  async prosesOrder(isadmin: string, orderKey: string) {
    if (isadmin === 'admin') await this.orderlistServ.updateStatusOrderAdmin(orderKey);
    else await this.orderlistServ.updateStatusOrderSelesai(orderKey);

    this.openWA();
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/tabs/orderlist');
  }

  async selesaiOrder(isadmin: string, orderKey: string) {
    if (isadmin === 'admin') await this.orderlistServ.updateStatusOrderSelesai(orderKey);
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/tabs/orderlist');
  }

  async cancelOrder(isadmin: string, orderKey: string) {
    await this.cancelAlertRadio(isadmin, orderKey);
  }

  async cancelAlertRadio(isadmin: string, orderKey: string) {
    const alert = await this.alertCtrl.create({
      header: 'Batalkan Pesanan?',
      subHeader: 'Apakah anda yakin ingin membatalkan pesanan? Pilih alasan anda',
      inputs: [
        {
          name: 'noStock',
          type: 'radio',
          label: 'Stok Kosong',
          value: 'Stok Kosong'
        },
        {
          name: 'noDriver',
          type: 'radio',
          label: 'Pengantar tidak ada',
          value: 'Pengantar tidak ada'
        },
        {
          name: 'noReason',
          type: 'radio',
          label: 'Lain-lain',
          value: 'lain-lain'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Lanjut',
          handler: (data: string) => {
            console.log("alert cancel: ", data);
            if (isadmin === 'admin') this.orderlistServ.updateStatusOrderBatal(orderKey, data);
            this.openWABatal(data);
            this.modalCtrl.dismiss();
            this.router.navigateByUrl('/tabs/orderlist');
          }
        }
      ]
    });
    await alert.present();
  }

  async openWA() {
    const countrycode = "62";
    const waPembeli = parseInt(this.pembeliNotelp);
    const text = "Terima kasih sudah memesan lewat deltoomart, kami akan segera memproses pesanan anda!";
    const urlWA = "https://wa.me/" + countrycode + waPembeli + "?text=" + text;

    const alert = await this.alertCtrl.create({
      header: 'Perhatian',
      message: 'Anda akan diarahkan ke Whatsapp Messenger untuk konfirmasi order ke pembelil!',
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

  async openWABatal(alasan: string) {
    const countrycode = "62";
    const waPembeli = parseInt(this.pembeliNotelp);
    const text = "Mohon maaf pesanan anda kami batalkan karena " + alasan + ". Salam, deltoomart app";
    const urlWA = "https://wa.me/" + countrycode + waPembeli + "?text=" + text;

    const alert = await this.alertCtrl.create({
      header: 'Perhatian',
      message: 'Anda akan diarahkan ke Whatsapp Messenger untuk konfirmasi order ke pembeli!',
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
