import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageModule } from 'src/app/home/home.module';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('src/app/pages/home/home.module').then(m =>
          m.HomePageModule),
      },
      {
        path: 'cart',
        loadChildren: () => import('src/app/pages/cart/cart.module').then(m =>
          m.CartPageModule),
      },
      {
        path: 'orderlist',
        loadChildren: () => import('src/app/pages/orderlist/orderlist.module').then(m =>
          m.OrderlistPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('src/app/pages/profile/profile.module').then(m =>
          m.ProfilePageModule),
      },
    ]
  },
  {
    path: 'detail/:key',
    loadChildren: () => import('src/app/pages/detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('src/app/pages/fav/fav.module').then(m => m.FavPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
