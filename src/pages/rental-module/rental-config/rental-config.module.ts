import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalConfigPage } from './rental-config';
import { RentalComponentsModule } from "../../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    RentalConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(RentalConfigPage),
    RentalComponentsModule
  ],
})
export class RentalConfigPageModule {}
