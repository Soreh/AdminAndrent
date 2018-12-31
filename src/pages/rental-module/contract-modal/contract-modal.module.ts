import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractModalPage } from './contract-modal';

@NgModule({
  declarations: [
    ContractModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractModalPage),
  ],
})
export class ContractModalPageModule {}
