import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { RentalServiceProvider } from "../../../providers/rentals/rental-service/rental-service";

import { Rental } from "../../../models/rentals/rental.interface";
import { Quotation } from '../../../models/rentals/quotation.class';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { Observable } from 'rxjs/Observable';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
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
  public rentals$: Observable<any>;

  public rentalList: Rental[];

  constructor(
    private rentalProvider: RentalServiceProvider, 
    private navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    private user : UserServiceProvider,
    private auth: AuthServiceProvider,
    private struct: StructureServiceProvider) {
  }

  /**
   * Depracted ? Try to abstract it in the RentalProvider
   */
  // private getRentalsList(struct_key): void {
  //   this.rentalProvider.mockGetRentalsInformation(struct_key).subscribe( data => this.rentals$ = data);
  // }

  ionViewWillLoad() {
    console.log('ionViewWillLoad RentalsPage');

    this.auth.isConnected().then( (ok) => {
      if (!ok) {
        console.error('Erreur : pas d\'utilisteur connecté');
        this.navCtrl.setRoot('ConnectPage');
      } else {
        this.struct.isStructureLoaded().then( (ok) => {
          if (!ok) {
            console.error('Erreur, aucune structure chargée');
            this.auth.logOut();
            this.navCtrl.setRoot('ConnectPage');
          } else {
            if ( ! this.rentalProvider.isConfigLoaded() ) {
              this.rentalProvider.loadConfig().then( () => 
                this.retrieveRentals()
              );
            } else {
              this.retrieveRentals()
            }
          }
        })
      }
    });
  }

  ionViewWillEnter() {
    console.log('coucou');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalsPage');
  }

  retrieveRentals() {
    this.rentalProvider.getRentals().then(
      docs => {
        docs.get().then( listSnap => {
          this.rentalList = [];
          listSnap.forEach( snap => {
            let rental = <Rental>snap.data();
            rental.id = snap.id;
            this.rentalList.push(rental);
          });
          return false
        });
      }
    );
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
