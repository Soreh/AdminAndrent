import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
import { RentalServiceProvider } from '../providers/rental-service/rental-service';
// import { RentalsPage } from "../pages/rentals/rentals";

import { PipesModule } from "../pipes/pipes.module";
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ModulesProvider } from '../providers/modules/modules';
import { StructureServiceProvider } from '../providers/structure-service/structure-service';
// import { ComponentsModule } from "../components/components.module";
// import { RentalComponentsModule } from "../components/rentals/rental.components.module";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    PipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RentalServiceProvider,
    UserServiceProvider,
    ModulesProvider,
    StructureServiceProvider
  ]
})
export class AppModule {}
