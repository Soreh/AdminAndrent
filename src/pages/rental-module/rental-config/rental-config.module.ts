import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalConfigPage } from './rental-config';

@NgModule({
  declarations: [
    RentalConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(RentalConfigPage),
  ],
})
export class RentalConfigPageModule {}
