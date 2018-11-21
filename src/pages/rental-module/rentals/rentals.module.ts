import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalsPage } from './rentals';
import { RentalComponentsModule } from "../../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    RentalsPage,
  ],
  imports: [
    IonicPageModule.forChild(RentalsPage),
    RentalComponentsModule,
  ],
})
export class RentalsPageModule {}
