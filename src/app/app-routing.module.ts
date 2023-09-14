import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePageModule } from './home/home.module';
import { MerchantDetailPageModule } from './merchant-detail/merchant-detail.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'merchant',
    loadChildren: () => import('./merchant-detail/merchant-detail.module').then( m => m.MerchantDetailPageModule)
  },
];

// const routes: Routes = [
//   { path : 'home', component:HomePageModule },
//   { path : 'merchant', component:MerchantDetailPageModule }
// ]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
