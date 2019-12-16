import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyTextPage } from './modify-text';

@NgModule({
  declarations: [
    ModifyTextPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyTextPage),
  ],
})
export class ModifyTextPageModule {}
