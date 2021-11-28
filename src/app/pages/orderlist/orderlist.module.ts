import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderlistPageRoutingModule } from './orderlist-routing.module';

import { OrderlistPage } from './orderlist.page';
import { BadgeModule } from 'src/app/components/badge/badge.module';
import { OrderModalComponent } from 'src/app/components/order-modal/order-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderlistPageRoutingModule,
    BadgeModule
  ],
  declarations: [OrderlistPage, OrderModalComponent],
  entryComponents: [OrderModalComponent]
})
export class OrderlistPageModule { }
