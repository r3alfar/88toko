import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ProductCardComponent],
    imports: [CommonModule, IonicModule],
    exports: [ProductCardComponent]
})
export class ProductCardModule { }