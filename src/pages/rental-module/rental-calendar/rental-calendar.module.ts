import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalCalendarPage } from './rental-calendar';
import { RentalComponentsModule } from "../../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    RentalCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(RentalCalendarPage),
    RentalComponentsModule
  ],
})
export class RentalCalendarPageModule {}
