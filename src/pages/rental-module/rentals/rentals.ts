import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';


import { Rental } from "../../../models/rentals/rental.interface";
import { Quotation } from '../../../models/rentals/quotation.class';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';


import { RentalServiceProvider } from "../../../providers/rentals/rental-service/rental-service";
import { Observable, Subscription } from 'rxjs';


import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserProfile } from '../../../models/global/user-profile.interface';
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
export class RentalsPage implements OnInit, OnDestroy {

  //public configKey;
  public rentals$: Observable<any>;

  public rentalList$: Observable<Rental[]>; // should I type it ? AngularFirestoreCollection<Rental>
  public rentalCount: number;
  public rentalList: Rental[];

  private _sub: Subscription;

  public rentalsCharged: boolean;

  constructor(
    private rentalProvider: RentalServiceProvider, 
    private navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    private user : UserServiceProvider,
    private auth: AuthServiceProvider,
    private struct: StructureServiceProvider,
    private loader: LoadingController) {
      console.debug('rentals page');
  }

  /**
   * Depracted ? Try to abstract it in the RentalProvider
   */
  // private getRentalsList(struct_key): void {
  //   this.rentalProvider.mockGetRentalsInformation(struct_key).subscribe( data => this.rentals$ = data);
  // }


  ngOnInit() {
    console.log('RentalsPage OnInit !');
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
            this.retrieveRentals();
          }
        })
      }
    });
  }

  ngOnDestroy() {
    if (this._sub) {
      console.debug("Subscription on rentals[] closed");
      this._sub.unsubscribe();
    }
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad RentalsPage');

    // this.auth.isConnected().then( (ok) => {
    //   if (!ok) {
    //     console.error('Erreur : pas d\'utilisteur connecté');
    //     this.navCtrl.setRoot('ConnectPage');
    //   } else {
    //     this.struct.isStructureLoaded().then( (ok) => {
    //       if (!ok) {
    //         console.error('Erreur, aucune structure chargée');
    //         this.auth.logOut();
    //         this.navCtrl.setRoot('ConnectPage');
    //       } else {
    //         if ( ! this.rentalProvider.isConfigLoaded() ) {
    //           this.rentalProvider.loadConfig().then( () => 
    //             this.retrieveRentals()
    //           );
    //         } else {
    //           this.retrieveRentals()
    //         }
    //       }
    //     })
    //   }
    // });
  }

  // async rentalsExist(): Promise<boolean> {
  //   return this.rentalProvider.getRentalscount().then(
  //     (count) => {
  //       console.log(count);
  //       if (count > 0) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     }
  //   );
  // }

  ionViewWillEnter() {
    // console.log('coucou');
    // this.retrieveRentals();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalsPage');
  }

  ionViewDidLeave() {
    
  }

  async retrieveRentals() {
    const loading = await this.loader.create();
    try {
      this.rentalProvider.getRentals().then(
        async (list) => {
          try {
            this.rentalList$ = list.valueChanges();
            this._sub = await list.valueChanges().subscribe(
              (list) => {
                console.debug(list.length);
                list = list.sort((a, b) => {
                  if(a.status < b.status) return -1;
                  else if (a.status > b.status) return 1;
                  else return 0
                })
                this.rentalList = list;
                this.rentalCount = list.length;
                this.rentalsCharged = true;
                loading.dismiss();
              }
            )
          } catch (error) {
            console.warn(error);
            loading.dismiss();
            this.navCtrl.setRoot('StartPage');
          }
          // Et la suppression de la subscription ?... 
        }
      )
    } catch (error) {
      console.warn("Aucune locations en base de données");
    }
    loading.present();
  }

  openNewRentalModal() {
    let modal = this.modalCtrl.create('NewRentalModalPage');
    modal.present();
    modal.onDidDismiss((newId) => this.seeRentalDetails(newId));
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
