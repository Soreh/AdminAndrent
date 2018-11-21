import { Component, Input } from '@angular/core';
import { NavController, AlertController } from "ionic-angular";
import { Rental } from '../../../models/rentals/rental.interface';
import { Quotation } from '../../../models/rentals/quotation.class';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
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

  constructor(public navCtrl : NavController, private alertCtrl : AlertController, private structService: StructureServiceProvider, private userService: UserServiceProvider) {
    console.log('Hello RentalMenuComponent Component');
    if ( !this.userService.getConnectedUser() || !this.structService.getLoadedStructureKey()){
      this.pages = [];
    } else {
      this.pages = [
        {
          label : 'Home',
          page : 'StartPage',
          data : {
            user : this.userService.getConnectedUser(),
          }
        },
        {
          label : 'Calculer un devis',
          page : 'RentalQuotationDashPage',
          data : {
            quotation : new Quotation(),
            config_key : 'config_1', // A récupérer dynamiquement !
          }
        },
        {
          label : 'Toutes  les locations',
          page : 'RentalsPage',
          data : {
            struct_key : this.structService.getLoadedStructureKey(),
          }
        }
      ];
    }
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  goToPage(page, passedData = null) : void {
    if (passedData != null){
      console.log(passedData);
      this.navCtrl.setRoot(page, {
        data : passedData,
      })
    } else {
      this.navCtrl.setRoot(page);
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
            this.navCtrl.setRoot('ConnectPage');
          }
        }
      ]
    }).present();
  }

  ngOninit(){

  }
}
