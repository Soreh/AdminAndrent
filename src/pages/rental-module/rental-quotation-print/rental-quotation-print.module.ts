import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalQuotationPrintPage } from './rental-quotation-print';
import { RentalComponentsModule } from "../../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    RentalQuotationPrintPage,
  ],
  imports: [
    IonicPageModule.forChild(RentalQuotationPrintPage),
    RentalComponentsModule
  ],
})
export class RentalQuotationPrintPageModule {}
