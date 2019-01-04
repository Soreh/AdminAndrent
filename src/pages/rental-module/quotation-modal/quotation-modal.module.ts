import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotationModalPage } from './quotation-modal';

@NgModule({
  declarations: [
    QuotationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotationModalPage),
  ],
})
export class QuotationModalPageModule {}
