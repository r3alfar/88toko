import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainCategoryComponent } from './main-category.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [MainCategoryComponent],
    imports: [CommonModule, IonicModule],
    exports: [MainCategoryComponent],
})
export class MainCategoryModule { }