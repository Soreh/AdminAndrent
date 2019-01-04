import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddInvoiceModalPage } from './add-invoice-modal';

@NgModule({
  declarations: [
    AddInvoiceModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddInvoiceModalPage),
  ],
})
export class AddInvoiceModalPageModule {}
