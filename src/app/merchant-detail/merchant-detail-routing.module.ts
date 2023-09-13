import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchantDetailPage } from './merchant-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MerchantDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantDetailPageRoutingModule {}
