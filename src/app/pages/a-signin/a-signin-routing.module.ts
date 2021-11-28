import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ASigninPage } from './a-signin.page';

const routes: Routes = [
  {
    path: '',
    component: ASigninPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ASigninPageRoutingModule {}
