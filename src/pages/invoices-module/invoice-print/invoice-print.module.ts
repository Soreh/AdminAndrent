import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicePrintPage } from './invoice-print';

@NgModule({
  declarations: [
    InvoicePrintPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoicePrintPage),
  ],
})
export class InvoicePrintPageModule {}
