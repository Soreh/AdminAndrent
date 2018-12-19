import { Component } from '@angular/core';
import { Platform, App, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './app.firebase.config'

//import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = 'ConnectPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private _app: App, private _ionicApp: IonicApp, private _menu: MenuController) {
   //firebase.initializeApp(FIREBASE_CONFIG);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // this.setupBackButtonBehavior (); 
    });
  }

  private setupBackButtonBehavior () {

    // If on web version (browser)
    if (window.location.protocol !== "file:") {

      // Register browser back button action(s)
      window.onpopstate = (evt) => {

        // Close menu if open
        if (this._menu.isOpen()) {
          this._menu.close ();
          return;
        }

        // Close any active modals or overlays
        let activePortal = this._ionicApp._loadingPortal.getActive() ||
          this._ionicApp._modalPortal.getActive() ||
          this._ionicApp._toastPortal.getActive() ||
          this._ionicApp._overlayPortal.getActive();

        if (activePortal) {
          activePortal.dismiss().catch((err)=>{console.log('gotcha (in dismiss)', err)});
          return;
        }

        var myNav = this._app.getActiveNavs()[0];
        console.log(myNav);
        // Navigate back
        if (myNav.canGoBack()) myNav.pop();

      };

      // Fake browser history on each view enter
      this._app.viewDidEnter.subscribe((app) => {
        history.pushState (null, null, "");
      });

    }
    
  }

}

