import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewRentalModalPage } from './new-rental-modal';
import { RentalComponentsModule } from "../../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    NewRentalModalPage,
  ],
  imports: [
    IonicPageModule.forChild(NewRentalModalPage),
    RentalComponentsModule
  ],
})
export class NewRentalModalPageModule {}
