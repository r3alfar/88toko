import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ASigninPageRoutingModule } from './a-signin-routing.module';

import { ASigninPage } from './a-signin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ASigninPageRoutingModule
  ],
  declarations: [ASigninPage]
})
export class ASigninPageModule { }
