import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BSignupPage } from './b-signup.page';

const routes: Routes = [
  {
    path: '',
    component: BSignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BSignupPageRoutingModule {}
