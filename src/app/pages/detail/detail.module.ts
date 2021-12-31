import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { BadgeModule } from 'src/app/components/badge/badge.module';
import { ProductCardModule } from 'src/app/components/product-card/product-card.module';
import { EdititemModalComponent } from 'src/app/components/edititem-modal/edititem-modal.component';


// Import Swiper.js pengganti ion-slides
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    BadgeModule,
    ProductCardModule,
    SwiperModule,
  ],
  declarations: [DetailPage, EdititemModalComponent],
  entryComponents: [EdititemModalComponent]
})
export class DetailPageModule { }
