import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahprodukPageRoutingModule } from './tambahproduk-routing.module';

import { TambahprodukPage } from './tambahproduk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahprodukPageRoutingModule
  ],
  declarations: [TambahprodukPage]
})
export class TambahprodukPageModule {}
