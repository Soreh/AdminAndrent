import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from "../../models/global/user.interface";
import { UserServiceProvider } from '../../providers/global/user-service/user-service';
import { Observable } from 'rxjs/Observable';

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

  username: string;
  password: string;
  user$: User;
  errorMsg : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectPage');
  }

  connect() {
    // Connect Mock User
    this.userService.connectMockUser
    (this.username).subscribe(user =>
      this.user$ = user);
    // Look for existing structure
    // If so load StartPage with the default structure
    if( this.user$){
      this.navCtrl.setRoot('StartPage', {
        data : {
          user : this.user$,
        }
      });
    }
    // Otherwise load StartPage with no structure
    else {
      this.errorMsg = "Oops... Nom d'utilisateur ou mot de passe incorrect !";
    }
    // Prompt to create one
  }

}
