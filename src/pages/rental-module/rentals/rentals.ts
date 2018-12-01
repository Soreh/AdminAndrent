import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { RentalServiceProvider } from "../../../providers/rentals/rental-service/rental-service";

import { Rental } from "../../../models/rentals/rental.interface";
import { Quotation } from '../../../models/rentals/quotation.class';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { Observable } from 'rxjs/Observable';
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

  //public configKey;
  public rentals$: Observable<Rental[]>;

  constructor(private rentalProvider: RentalServiceProvider, private navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private user : UserServiceProvider) {
  }

  /**
   * Depracted ? Try to abstract it in the RentalProvider
   */
  // private getRentalsList(struct_key): void {
  //   this.rentalProvider.mockGetRentalsInformation(struct_key).subscribe( data => this.rentals$ = data);
  // }

  ionViewWillLoad() {
    console.log('ionViewWillLoad RentalsPage');
    if (!this.user.isConnected())
    {
      console.error('Erreur : pas d\'utilisteur connecté');
      this.navCtrl.setRoot('ConnectPage');
    } else
    {
      //console.log(this.navParams.get('data'));
      this.rentals$ = this.rentalProvider.getRentals();
      //this.getRentalsList(this.navParams.get('data').struct_key);
      
      // if (this.navParams.get('data').config_key) {
      //   //this.configKey = this.navParams.get('data').config_key;
      // } else {
      //   console.log ('Erreur : pas de config_key reçue');
      // }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalsPage');
  }

  // checkRentals() : boolean {
  //   if (this.rentals$) {
  //     if (this.rentals$.length > 0) {
  //       return true;
  //     }
  //   }
  // }

  openNewRentalModal() {
    let modal = this.modalCtrl.create('NewRentalModalPage');
    modal.present();
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
      }
    );
  }

  goStart(){
    this.navCtrl.setRoot('StartPage');
  }

}
