import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProdukService } from 'src/app/services/produk.service';
import { Produk } from 'src/app/models/produk.model';
import { NavigationExtras, Router } from '@angular/router';
import { RekomendasiService } from 'src/app/services/rekomendasi.service';
import { ProfilService } from 'src/app/services/profil.service';
import { Profile } from 'src/app/models/profile.model';
import firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  categories: Category[];
  products: Produk[] = [];
  productsSearch: Produk[] = [];
  productsSearchRes: Produk[] = [];
  produktfidf: Produk[] = [];
  prdDummy: Produk[];
  words: any[];
  profile: Profile;

  seg_categories = ['Sembako', 'Mkn&Bumbu', 'Minuman', 'Kesehatan', 'Dapur', 'Houseware'];

  constructor(
    private authServ: AuthService,
    private catServ: CategoryService,
    private productServ: ProdukService,
    private router: Router,
    private rekomendasiServ: RekomendasiService,
    private profileServ: ProfilService
  ) { }

  ngOnInit() {
    this.loaduser();
    this.loadCategories();
  }

  ionViewWillEnter() {
    this.isUserLoggedIn();
  }

  ionViewDidEnter() {
    this.segmentChanged();
  }

  isUserLoggedIn() {
    const user = firebase.auth().currentUser;
    if (user) {
      console.log("user logged on")
      this.loaduser();
    }
    else {
      console.log("user not found")
      //this.profile == null;
    }
  }

  searchData(ev: any) {
    console.log(ev.target.value);
    this.loadProducts2(ev.target.value.toString());
  }

  segmentChanged(segCatKey?) {
    if (segCatKey == undefined) {
      this.loadProducts();
    }
    else {
      this.loadProductsByCategory(segCatKey.detail.value);
      // this.products = this.products.filter(cat => cat.categoryId === segCatKey.detail.value.toString());
    }
  }

  loadCategories() {
    this.catServ.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      data = data.filter(item => item.parentId === 0);
      this.categories = data;
    });
  }

  loadProducts() {
    this.productServ.getAllProduk().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.products = data;
      console.log(data);
    });
  }

  loadProducts2(query: string) {
    this.productServ.getAllProduk().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.productsSearch = data;
      this.productsSearchRes = this.rekomendasiServ.getSearchResults(this.productsSearch, query);
      this.products = this.productsSearchRes.filter(val => val.nilaiSearchbyKeyword > 0);
      // console.log(data);
    });
  }

  loadProductsByCategory(prdid: string) {
    this.productServ.getProdukbyCategory(prdid).snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.products = data;
      console.log(this.products);
    });
  }

  loaduser() {
    this.authServ.userDetails().subscribe(res => {
      if (res === null) {
        this.profile = undefined;
      }
      else {
        this.profileServ.getProfile(this.authServ.getuid().toString()).valueChanges()
          .subscribe(data => {
            this.profile = data;
            // console.log(this.profile.favorites);
          });
      }
    });

  }

  // loaduser() {
  //   return new Promise<void>((resolve) => {
  //     this.profileServ.getProfile(this.authServ.getuid().toString()).valueChanges()
  //       .subscribe(data => {
  //         this.profile = data;
  //         //console.log(this.profile);
  //         resolve();
  //       });
  //   })
  // }

  // cobaExternalLibrary() {
  //   var sentence =
  //     "Perekonomian Indonesia sedang dalam pertumbuhan yang membanggakan";
  //   var sec_sentence = "Rancang Bangun SIstem Pakar berbasis web untuk Mendiagnosa Penyakit pada sapi Perah";
  //   var gather = sentence + " " + sec_sentence;
  //   var stemmed = [];
  //   var stemmer = new sastrawi.Stemmer();
  //   var tokenizer = new sastrawi.Tokenizer();
  //   var words = tokenizer.tokenize(gather);
  //   //var word = [];
  //   for (let word of words) {
  //     stemmed.push(stemmer.stem(word));
  //   }
  //   const sw_sentence = sw.removeStopwords(stemmed, sw.id);

  //   //console.log(words.length);
  //   // console.log("main sentence", sentence);
  //   // console.log("tokenize", words);
  //   // console.log("stemming", stemmed);
  //   // console.log("stopword removal", sw_sentence);
  //   console.log(sw_sentence);
  // }

  favItem(prodId: string) {
    this.productServ.setFavItem(this.authServ.getuid(), prodId);
  }

  unfavItem(prodKey: string) {
    this.productServ.unsetFavitem(this.authServ.getuid(), prodKey);
  }

  isFavOrUnfav(item: any[], prodId: string) {
    if (item) {
      if (Object.values(item).find(i => i.favitemId === prodId)) return true;
    }
    return false;
  }

  openDetailWithState(key: string) {
    let navExtras: NavigationExtras = {
      state: {
        produkKey: key
      }
    };
    this.router.navigate(['detail'], navExtras);
  }



}
