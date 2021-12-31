import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { last, map } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { NgForm } from '@angular/forms';
import { Produk } from 'src/app/models/produk.model';
import { ProdukService } from 'src/app/services/produk.service';
import { ComponentService } from 'src/app/services/component.service';

@Component({
  selector: 'app-additem-modal',
  templateUrl: './additem-modal.component.html',
  styleUrls: ['./additem-modal.component.scss'],
})
export class AdditemModalComponent implements OnInit {

  mainCategories: Category[];
  allSubCategories: Category[];
  selectedSubCat: Category[];

  maincat: any;
  subcat: any;
  valueMainCat: string;
  valueSubCat: string;
  lastProduk: Produk[];

  constructor(
    private modalCtrl: ModalController,
    private catServ: CategoryService,
    private produkServ: ProdukService,
    private compService: ComponentService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadLastProduct();
  }

  loadCategories() {
    this.catServ.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.mainCategories = data.filter(item => item.parentId === 0);
      this.allSubCategories = data.filter(item => item.parentId !== 0);
    });
  }

  loadLastProduct() {
    this.produkServ.getLastProduk().snapshotChanges().pipe(
      map(changes => changes.map(p => ({ key: p.payload.key, ...p.payload.val() })))
    ).subscribe(data => {
      this.lastProduk = data;
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  setSubCategory(maincat) {
    this.valueMainCat = maincat.key;
    this.selectedSubCat = this.allSubCategories.filter(item => item.parentId === maincat.key);
  }

  getSubCategory(subcat) {
    this.valueSubCat = subcat.key;
  }

  async onSubmit(form: NgForm) {

    const nama = form.value.nampro;
    const merk = form.value.merkpro;
    const harga = form.value.hargapro
    const kategori = this.valueMainCat;
    const subkategori = this.valueSubCat;
    const ukuran = form.value.ukuran;
    const deskripsi = form.value.deskpro;
    const fotoUrl = form.value.fotpro;
    const satuan = form.value.satuan;
    const lastPrdId = this.lastProduk[0].key;
    if (form.value.fotpro2) {
      var fotoUrl2 = form.value.fotpro2;
    }
    var tempFoto = [];
    tempFoto.push(fotoUrl);
    if (fotoUrl2) {
      tempFoto.push(fotoUrl2);
    }

    const lastPrdIdint = parseInt(this.lastProduk[0].key.substring(3));
    const tempId = lastPrdIdint.toString();

    var tempZeros = "";
    for (var i = tempId.length; i < 4; i++) {
      tempZeros += "0";
    }
    const newPrdId = "prd" + tempZeros + (lastPrdIdint + 1);

    const produk: any = {
      categoryId: kategori,
      subcatId: subkategori,
      nama: nama,
      size: ukuran,
      merk: merk,
      harga: harga,
      satuan: satuan,
      thumb: tempFoto,
      desc: deskripsi
    };

    console.log(tempFoto);

    const alert = await this.alertCtrl.create({
      header: 'Perhatian',
      message: 'Pastikan data yang anda isi sudah lengkap?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Submit',
          handler: () => {
            this.produkServ.addProduk(newPrdId, produk);
            form.reset();
            this.dismissModal();
          }
        }
      ]
    });

    alert.present();

    // const subkategori = form.value.subCategory;
    // console.log("LAST PRODUK ID: " + lastPrdId);
    // console.log("NEW ID: " + newPrdId);
    // console.log(nama + "/" + merk + "/" + harga + "/" + ukuran + "/" + satuan + "/" + deskripsi + "/" + fotoUrl);
    // console.log("kategori : " + kategori + " subkategori : " + subkategori);
  }

  // async alertSubmit() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Perhatian',
  //     message: 'Pastikan data yang anda isi sudah lengkap?',
  //     buttons: [
  //       {
  //         text: 'Cancel'
  //       },
  //       {
  //         text: 'Submit',
  //         handler: () => this.produkServ.addProduk()
  //       }
  //     ]
  //   });
  // }

}
