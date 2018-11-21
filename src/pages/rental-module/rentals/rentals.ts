import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { RentalServiceProvider } from "../../../providers/rentals/rental-service/rental-service";

import { Rental } from "../../../models/rentals/rental.interface";
import { Quotation } from '../../../models/rentals/quotation.class';
// import { Log } from "../../../models/rentals/log.interface";

/**
 * Generated class for the RentalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rentals',
  templateUrl: 'rentals.html',
})
export class RentalsPage {

  public configKey;
  public rentals: Rental[];

  constructor(private RentalProvider: RentalServiceProvider, private navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  private getRentalsList(struct_key): void {
    this.RentalProvider.mockGetRentalsInformation(struct_key).subscribe( data => this.rentals = data);
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad RentalsPage');
    if (!this.navParams.get('data'))
    {
      console.log('Erreur : pas de struct_key reçue');
      this.navCtrl.setRoot('ConnectPage');
    } else
    {
      console.log(this.navParams.get('data'));
      this.getRentalsList(this.navParams.get('data').struct_key);
      if (this.navParams.get('data').config_key) {
        this.configKey = this.navParams.get('data').config_key;
      } else {
        console.log ('Erreur : pas de config_key reçue');
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalsPage');
  }

  openNewRentalModal() {
    var dataToPass = {
      id: "l'id de la structure ?",
    }
    this.modalCtrl.create('NewRentalModalPage', dataToPass).present();
  }
  
  // goHome(): void {
  //   this.navCtrl.popToRoot();
  // }

  // seeRentalDetails(rentalID): void {
  //   this.navCtrl.push("RentalDetailsPage", {id: rentalID});
  // }

  // goCalculateQuotation(): void {
  //   let quotation = new Quotation();
  //   this.navCtrl.push('RentalQuotationDashPage', {
  //     data : quotation,
  //   })
  //   console.log(quotation);
  // }
  
  seeRentalDetails(rentalID): void {
    this.navCtrl.push("RentalDetailsPage", 
      {
        id: rentalID, 
        config_key : this.configKey
      }
    );
  }

  goStart(){
    this.navCtrl.setRoot('StartPage');
  }

}
