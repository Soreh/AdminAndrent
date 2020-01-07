import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeeEventsModalPage } from './see-events-modal';

@NgModule({
  declarations: [
    SeeEventsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SeeEventsModalPage),
  ],
})
export class SeeEventsModalPageModule {}
