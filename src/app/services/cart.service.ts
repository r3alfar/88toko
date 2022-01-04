import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private item$ = new BehaviorSubject<CartItem[]>([]);
  private Totall: any;
  private itemss: any;

  constructor(private db: AngularFireDatabase) { }

  getCart() {
    return this.item$.asObservable();
  }

  addToCart(addedItem: CartItem) {
    const items = this.item$.getValue();
    const checkDuplicate = items.find((item) => {
      if (item.key === addedItem.key) return 1;
      else return 0;
    });

    //console.log('isFound?= ', checkDuplicate);

    if (!checkDuplicate) this.item$.next([...this.item$.getValue(), addedItem]);
    else {
      const index = items.findIndex(item => item.key === addedItem.key);
      items[index].qty += 1;
      this.item$.next(items);
    }
  }

  removeItem(id: string) {
    this.item$.next(this.item$.getValue().filter(item => item.key !== id));
  }

  changeQty(quantity: number, id: string) {
    const items = this.item$.getValue();
    const index = items.findIndex(item => item.key === id);
    items[index].qty += quantity;
    this.item$.next(items);
    console.log(items);
    // const index = items.findIndex
  }

  getQty(id?: string) {
    if (this.item$) {
      const items = this.item$.getValue();
      const index = items.findIndex(item => item.key === id);

      if (index === -1) {
        const defaultqty = 0;
        return defaultqty;
      }
      else {
        console.log(items[index]);
        return items[index].qty
      }
      //return items[index].qty;
      // if (items[index].qty !== undefined) {
      //   return items[index].qty
      // }
      // else {
      //   const defaultqty = 0;
      //   return defaultqty;
      // }
    }
    // else {
    //   const defaultqty = 1;
    //   return defaultqty;
    // }
  }

  checkIfAddedToCart(id?: string) {
    if (this.item$) {
      const items = this.item$.getValue();
      const index = items.findIndex(item => item.key === id);

      if (index === -1) {
        return false;
      }
      else return true;
    }
  }

  getTotalQty() {
    if (this.item$) {
      const items = this.item$.getValue();
      var totalqty = 0;
      for (let item of items) {
        totalqty += item.qty;
      }
      return totalqty;
    }
    else return 0;
  }

  getTotalAmount() {
    return this.item$.pipe(
      map((items) => {
        let total = 0;
        items.forEach((item) => {
          total += item.qty * item.harga;
        });
        this.Totall = total;
        return total;
      })
    );
  }

  convertValuetoObj() {
    const itemList = this.item$.getValue();

    const ObjConverted = {};
    console.log(itemList.length);

    // for (let i = 0; i < itemList.length; i++) {
    //   ObjConverted[itemList[i].key] = {
    //     nama: itemList[i].nama,
    //     qty: itemList[i].qty,
    //     harga: itemList[i].harga,
    //     imageThumb: itemList[i].imageThumb
    //   };
    // }

    for (let i = 0; i < itemList.length; i++) {
      ObjConverted[itemList[i].key] = itemList[i].qty;
    }

    //console.log(ObjConverted);
    return ObjConverted;
  }

  addOrder(uid: string, opsiBayar: string) {
    // console.log(this.Totall);

    const orderDetails = {
      profileId: uid,
      isAccepted: false,
      isCompleted: false,
      totalPrice: this.Totall,
      timeOrdered: Date.now(),
      productsOrdered: this.convertValuetoObj(),
      opsibayar: opsiBayar
    };

    console.log(orderDetails);
    this.db.list(`orders/`).push(orderDetails);
    this.item$.next(this.item$.getValue().filter(item => !item));

    //load all products
    //potong stok
  }
}
