import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Favorites } from 'src/app/models/favorites.model';
import { Produk } from 'src/app/models/produk.model';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
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
    private produkService: ProdukService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadFav();
    this.loadAllProduk();
  }

  loadFav() {
    this.profileServ.getFavorites(this.authServ.getuid()).snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(data => {
      this.favList = data;
    })
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

}
