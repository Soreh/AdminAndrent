import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartPage } from './start';
import { GlobalComponentsModule } from "../../components/global/global.components.module";

@NgModule({
  declarations: [
    StartPage,
  ],
  imports: [
    IonicPageModule.forChild(StartPage),
    GlobalComponentsModule
  ],
})
export class StartPageModule {}
