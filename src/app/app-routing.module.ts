import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['a-signin']);
const redirectLoggedInToTabs = () => redirectLoggedInTo(['tabs']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'a-signin',
    loadChildren: () => import('./pages/a-signin/a-signin.module').then(m => m.ASigninPageModule),
    ...canActivate(redirectLoggedInToTabs)
  },
  {
    path: 'b-signup',
    loadChildren: () => import('./pages/b-signup/b-signup.module').then(m => m.BSignupPageModule),
    ...canActivate(redirectLoggedInToTabs)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    //...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/detail/detail.module').then(m => m.DetailPageModule),
    //...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'orderlist',
    loadChildren: () => import('./pages/orderlist/orderlist.module').then(m => m.OrderlistPageModule),
    //...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'fav',
    loadChildren: () => import('./pages/fav/fav.module').then(m => m.FavPageModule),
    //...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'tambahproduk',
    loadChildren: () => import('./pages/tambahproduk/tambahproduk.module').then(m => m.TambahprodukPageModule),
    //...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
