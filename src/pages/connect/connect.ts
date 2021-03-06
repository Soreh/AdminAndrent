import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Loading } from 'ionic-angular';

import { UserProfile } from "../../models/global/user-profile.interface";
import { UserServiceProvider } from '../../providers/global/user-service/user-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ConnectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connect',
  templateUrl: 'connect.html',
})
export class ConnectPage {

  email: string;
  password: string;
  user: UserProfile;
  errorMsg: string;

  loading: Loading;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private auth : AuthServiceProvider,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    private userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectPage');
  }

  ionViewWillEnter() {
    if (this.userService.getConnectedUser()){
      if( this.userService.disconnect() ) {
        console.info('User disconnected');
      }
    }
  }

  async logIn() {
    if (this.email && this.password) {
      this.auth.loginUser(this.email, this.password).then( 
        () => {
          this.loading.dismiss().then( () => {
            this.navCtrl.setRoot('StartPage');
          })
        },
        error => {
          if(error.code === "auth/invalid-email") {
            this.errorMsg = "Adresse mail non valide";
          } else if (error.code === "auth/user-not-found") {
            this.errorMsg = "Oops... L'utilisateur n'existe pas."
          } else if (error.code === "auth/wrong-password") {
            this.errorMsg = "Oops... Vous avez introduit un mauvais mot de passe."
          } else {
            this.errorMsg = `Impossible de se connecter | ${error.code}`;
          }
          this.loading.dismiss();
        }
      );
      this.loading = await this.loadCtrl.create();
      await this.loading.present();
    } else {
      this.errorMsg = "Adresse Email et mot de passe requis."
    }
  }

  // async connect() {
  //   //this.user$ = this.userService.login(this.email, this.password);
  //   if(this.email && this.password) {
  //     const response : LoginResponse = await this.userService.login(this.email, this.password);
  //     console.log(response);
  //     // this.user = await this.userService.login(this.email, this.password);
  //     // console.log(this.user);
  //     if ( response.uid ) {
  //       this.navCtrl.setRoot("StartPage");
  //     } else {
  //       if(response.error.code === "auth/invalid-email") {
  //         this.errorMsg = "Adresse mail non valide";
  //       } else if (response.error.code === "auth/user-not-found") {
  //         this.errorMsg = "Oops... L'utilisateur n'existe pas."
  //       } else if (response.error.code === "auth/wrong-password") {
  //         this.errorMsg = "Oops... Vous avez introduit un mauvais mot de passe."
  //       } 
  //        else {
  //         this.errorMsg = "Impossible de se connecter | "+ response.error.code;
  //       }
  //     }
  //   } else {
  //     this.errorMsg = "Nom d'utilisateur et mot de passe requis";
  //   }
  //   // Connect Mock User
  //   // if( this.userService.connectUser(this.username) ) {
  //   //   this.user$ = this.userService.getConnectedUser();
  //   //   this.navCtrl.setRoot('StartPage', {
  //   //     data : {
  //   //       user : this.user$,
  //   //     }
  //   //   });
  //   // } else {
  //   //   this.errorMsg = "Oops... Nom d'utilisateur ou mot de passe incorrect !";
  //   // }

  // }

}
