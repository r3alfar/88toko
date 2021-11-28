import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BSignupPageRoutingModule } from './b-signup-routing.module';

import { BSignupPage } from './b-signup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BSignupPageRoutingModule
  ],
  declarations: [BSignupPage]
})
export class BSignupPageModule { }
