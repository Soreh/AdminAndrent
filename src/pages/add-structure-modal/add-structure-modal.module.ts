import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddStructureModalPage } from './add-structure-modal';
import { GlobalComponentsModule } from "../../components/global/global.components.module";

@NgModule({
  declarations: [
    AddStructureModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddStructureModalPage),
    GlobalComponentsModule
  ],
})
export class AddStructureModalPageModule {}
