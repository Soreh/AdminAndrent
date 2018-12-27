import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigPage } from './config';
import { RentalComponentsModule } from "../../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    ConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigPage),
    RentalComponentsModule
  ],
})
export class ConfigPageModule {}
