import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore'; 
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from "@angular/fire/database";

import { FIREBASE_CONFIG } from "./app.firebase.config2";

import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
import { RentalServiceProvider } from '../providers/rentals/rental-service/rental-service';
// import { RentalsPage } from "../pages/rentals/rentals";

import { PipesModule } from "../pipes/pipes.module";
import { UserServiceProvider } from '../providers/global/user-service/user-service';
import { ModulesProvider } from '../providers/global/modules/modules';
import { StructureServiceProvider } from '../providers/global/structure-service/structure-service';
import { LogController } from "../controllers/log.controller";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { CalendarServiceProvider } from "../providers/rentals/calendar/calendar-service";
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
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RentalServiceProvider,
    UserServiceProvider,
    ModulesProvider,
    StructureServiceProvider,
    LogController,
    AuthServiceProvider,
    CalendarServiceProvider
  ]
})
export class AppModule {}
