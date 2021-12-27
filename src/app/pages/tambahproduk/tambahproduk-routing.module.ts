import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahprodukPage } from './tambahproduk.page';

const routes: Routes = [
  {
    path: '',
    component: TambahprodukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahprodukPageRoutingModule {}
