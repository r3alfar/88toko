import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Orderan } from '../models/orders.model';
import { AuthService } from './authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderlistService {

  constructor(
    private dbsource: AngularFireDatabase,
    private authServ: AuthService
  ) { }

  getTransaction(key: string) {
    return this.dbsource.object(`orders/${key}`)
  }

  getAllTransaction(uid: string): AngularFireList<Orderan> {
    return this.dbsource.list(`orders/`, ref => ref.orderByChild('profileId').equalTo(uid));
  }

  getAdminViewTransaction(): AngularFireList<Orderan> {
    return this.dbsource.list(`orders/`);
  }

  updateStatusOrderAdmin(orderKey: string) {
    return this.dbsource.object(`orders/${orderKey}`).update({ isAccepted: true });
  }

  updateStatusOrderSelesai(orderKey: string) {
    return this.dbsource.object(`orders/${orderKey}`).update({ isCompleted: true });
  }


}
