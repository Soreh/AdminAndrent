import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectPage } from './connect';

//import { AngularFireAuthModule } from "angularfire2/auth";

@NgModule({
  declarations: [
    ConnectPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectPage),
    //AngularFireAuthModule
  ],
})
export class ConnectPageModule {}
