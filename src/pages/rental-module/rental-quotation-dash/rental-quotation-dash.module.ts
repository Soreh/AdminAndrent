import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalQuotationDashPage } from './rental-quotation-dash';
import { PipesModule } from "../../../pipes/pipes.module";
import { RentalComponentsModule } from "../../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    RentalQuotationDashPage,
  ],
  imports: [
    IonicPageModule.forChild(RentalQuotationDashPage),
    PipesModule,
    RentalComponentsModule
  ],
})
export class RentalQuotationDashPageModule {}
