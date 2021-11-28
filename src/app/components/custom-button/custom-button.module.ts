import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './custom-button.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [CustomButtonComponent],
    imports: [CommonModule, IonicModule],
    exports: [CustomButtonComponent],
})
export class CustomButtonModule { }