import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalDetailsPage } from './rental-details';
import { RentalComponentsModule } from "../../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    RentalDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RentalDetailsPage),
    RentalComponentsModule
  ],
})
export class RentalDetailsPageModule {}
