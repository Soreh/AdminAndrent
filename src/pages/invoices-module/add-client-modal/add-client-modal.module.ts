import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddClientModalPage } from './add-client-modal';

@NgModule({
  declarations: [
    AddClientModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddClientModalPage),
  ],
})
export class AddClientModalPageModule {}
