import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddParagraphModalPage } from './add-paragraph-modal';

@NgModule({
  declarations: [
    AddParagraphModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddParagraphModalPage),
  ],
})
export class AddParagraphModalPageModule {}
