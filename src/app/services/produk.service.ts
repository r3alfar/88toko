import { Injectable, Query } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Produk } from '../models/produk.model';

@Injectable({
  providedIn: 'root'
})
export class ProdukService {

  constructor(
    private dbsource: AngularFireDatabase,
  ) { }

  getProduk(key: string): AngularFireObject<Produk> {
    return this.dbsource.object(`products/${key}`);
  }

  getLastProduk(): AngularFireList<Produk> {
    return this.dbsource.list(`products/`, ref => ref.limitToLast(1));
  }

  addProduk(newId: string, produk: Produk) {
    this.dbsource.object(`products/${newId}`).update(produk);
  }

  editProduk(key: string, produk: Produk) {
    return this.dbsource.list('products/').update(key, produk);
  }

  deleteProduk(key: string) {
    this.dbsource.object(`products/` + key).remove();
  }


  getAllProduk(where?: string[]): AngularFireList<Produk> {
    if (where === undefined) {
      return this.dbsource.list(`products/`);
    }
    return this.dbsource.list(`products/`, ref => ref.orderByChild(where[0]).equalTo(where[1]));
  }

  getProdukbyCategory(prdid: string): AngularFireList<Produk> {
    return this.dbsource.list(`products/`, ref => ref.orderByChild('categoryId').equalTo(prdid));
  }

  setFavItem(uid: string, prdId: string) {
    const fav = {
      favitemId: prdId
    }

    this.dbsource.list(`profile/${uid}/favorites/`).push(fav);
  }

  unsetFavitem(uid: string, itemKey: string) {
    this.dbsource.list(`profile/${uid}/favorites/`).remove(itemKey);
  }

}
