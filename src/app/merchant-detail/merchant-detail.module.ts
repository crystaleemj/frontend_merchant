import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchantDetailPageRoutingModule } from './merchant-detail-routing.module';

import { MerchantDetailPage } from './merchant-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MerchantDetailPageRoutingModule
  ],
  declarations: [MerchantDetailPage]
})
export class MerchantDetailPageModule {}
