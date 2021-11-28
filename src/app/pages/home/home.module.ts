import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SearchbarModule } from 'src/app/components/searchbar/searchbar.module'
import { MainCategoryModule } from 'src/app/components/main-category/main-category.module';
import { ProductCardModule } from 'src/app/components/product-card/product-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SearchbarModule,
    MainCategoryModule,
    ProductCardModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
