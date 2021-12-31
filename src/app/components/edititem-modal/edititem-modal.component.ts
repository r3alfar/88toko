import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { Produk } from 'src/app/models/produk.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProdukService } from 'src/app/services/produk.service';

@Component({
  selector: 'app-edititem-modal',
  templateUrl: './edititem-modal.component.html',
  styleUrls: ['./edititem-modal.component.scss'],
})
export class EdititemModalComponent implements OnInit {
  @Input() productKey: any;

  mainCategories: Category[];
  allSubCategories: Category[];
  selectedSubCat: Category[];
  catList: Category[];

  maincat: any;
  subcat: any;
  valueMainCat: string;
  valueSubCat: string;
  compareWith: any;

  produk: Produk;

  constructor(
    private modalCtrl: ModalController,
    private catServ: CategoryService,
    private productServ: ProdukService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadProduk();
    this.compareWith = this.compareWithFn;
  }

  loadProduk() {
    this.productServ.getProduk(this.productKey).valueChanges()
      .subscribe(data => {
        this.produk = data;
      });
  }

  loadCategories() {
    this.catServ.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.catList = data;
      this.mainCategories = data.filter(item => item.parentId === 0);
      this.allSubCategories = data.filter(item => item.parentId !== 0);
    });
  }

  setSubCategory(maincat) {
    this.valueMainCat = maincat.key;
    this.selectedSubCat = this.allSubCategories.filter(item => item.parentId === maincat.key);
  }

  getSubCategory(subcat) {
    this.valueSubCat = subcat.key;
  }

  findCategory(catId: string) {
    return {
      ...this.catList.find((cat) => {
        return cat.key === catId;
      })
    };
  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  }

  async onSubmitUpdate(form: NgForm) {
    //move url foto ke array
    const fotoUrl = form.value.fotpro;
    if (form.value.fotpro2) {
      var fotoUrl2 = form.value.fotpro2;
    }
    var tempFoto = [];
    tempFoto.push(fotoUrl);
    if (fotoUrl2) {
      tempFoto.push(fotoUrl2);
    }

    const produk: any = {
      categoryId: this.valueMainCat,
      subcatId: this.valueSubCat,
      nama: form.value.nampro,
      size: form.value.ukuran,
      merk: form.value.merkpro,
      harga: form.value.hargapro,
      satuan: form.value.satuan,
      thumb: tempFoto,
      desc: form.value.deskpro
    };

    console.log(produk);

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
            this.productServ.editProduk(this.productKey, produk);
            form.reset();
            this.dismissModal();
          }
        }
      ]
    });

    alert.present();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
