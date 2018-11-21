import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewRentalModalPage } from './new-rental-modal';

@NgModule({
  declarations: [
    NewRentalModalPage,
  ],
  imports: [
    IonicPageModule.forChild(NewRentalModalPage),
  ],
})
export class NewRentalModalPageModule {}
