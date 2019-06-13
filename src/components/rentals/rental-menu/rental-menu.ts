import { Component } from '@angular/core';
import { NavController, AlertController } from "ionic-angular";
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';

/**
 * Generated class for the RentalMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rental-menu',
  templateUrl: 'rental-menu.html'
})
export class RentalMenuComponent {

  // @Input() menu : string;
  // @Input() title : string;

  root:string = 'ConnectPage';
  pages;
  username:string;

  constructor(
    public navCtrl : NavController, 
    private alertCtrl : AlertController,
    private auth: AuthServiceProvider,
    private user: UserServiceProvider) {
    console.log('Hello RentalMenuComponent Component');

      this.user.getUserName().then(
        (pseudo) => {
          this.username = pseudo;
        }
      )
      
      this.pages = [
        {
          label : 'Home',
          page : 'StartPage',
          // data : {
          //   user : this.userService.getConnectedUser(),
          // },
        },
        {
          label : 'Calcul',
          page : 'RentalQuotationDashPage',
          data : {
            //quotation : new Quotation(),
            //config_key : 'config_1', // A récupérer dynamiquement !
            push: true,
          },
          push : true,
        },
        {
          label : 'Locations',
          page : 'RentalsPage',
          // data : {
          //   struct_key : this.structService.getLoadedStructureKey(),
          // }
        },
        {
          label : 'Config',
          page : 'RentalConfigPage',
          data : {
            push : true,
          },
          push: false,
        }
      ];

  }

  goBack(): void {
    this.navCtrl.pop();
  }

  // goToPage(page, passedData = null) : void {
  //   if (passedData != null){
  //     console.log(passedData);
  //     if( passedData.push) {
  //       this.navCtrl.push(page, {
  //         data : passedData,
  //       })
  //     } else {
  //       this.navCtrl.setRoot(page, {
  //         data : passedData,
  //       })
  //     }
  //   } else {
  //     this.navCtrl.setRoot(page);
  //   }
  // }
  goToPage(page) : void {
    if(page.push){
      this.navCtrl.push(page.page);
    } else {
      this.navCtrl.setRoot(page.page);
    }
  }

  disconnect() : void {
    this.alertCtrl.create({
      title : "Attention",
      subTitle : "Toute modification non enregistrée sera perdue.",
      buttons : [
        {
          text : 'Annuler',
          role : 'cancel',
        },
        {
          text : "Je m'en fiche...",
          handler : () => {
            this.auth.logOut().then(() => this.navCtrl.setRoot('ConnectPage'));
          }
        }
      ]
    }).present();
  }

  ngOninit(){

  }
}
