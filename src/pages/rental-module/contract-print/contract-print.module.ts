import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractPrintPage } from './contract-print';

@NgModule({
  declarations: [
    ContractPrintPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractPrintPage),
  ],
})
export class ContractPrintPageModule {}
