import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDateModalPage } from './add-date-modal';

@NgModule({
  declarations: [
    AddDateModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDateModalPage),
  ],
})
export class AddDateModalPageModule {}
