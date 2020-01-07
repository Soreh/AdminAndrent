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
import { STATUSCODE } from '../../../models/global/status.interface';
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

  public rentalListFirstContact: Rental[] = [];
  public rentalListConfirmed: Rental[] = [];
  public rentalListOption: Rental[] = [];
  public rentalListOver: Rental[] = [];
  public rentalListCanceled: Rental[] = [];
  public rentalListToBePaid: Rental[] = [];

  public seeFirstContact = false;
  public seeListConfirmed = false;
  public seeListOption = true;
  public seeListOther = false;
  public seeListDuePayment = false;
  public seeAll = false;

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

  public switchTab(tab: number) {
    this.seeFirstContact = false;
    this.seeListConfirmed = false;
    this.seeListOption = false;
    this.seeListOther = false;
    this.seeListDuePayment = false;
    this.seeAll = false;
    switch (tab) {
      case 1:
        this.seeListOption = true;
        break;
      case 2:
        this.seeFirstContact = true;
        break;
      case 3:
        this.seeListConfirmed = true;
        break;
      case 4:
        this.seeListOther = true;
        break;
      case 5:
        this.seeListDuePayment = true;
        break;
      case 6:
        this.seeAll = true;
        break;
      default:
        break;
    }
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
                  else if (a.status > b.status ) return 1;
                  else return 0
                });
                this.rentalListFirstContact = [];
                this.rentalListConfirmed = [];
                this.rentalListOption = [];
                this.rentalListOver = [];
                this.rentalListCanceled = [];
                this.rentalListToBePaid = [];
                this.rentalList = list;
                this.rentalCount = list.length;
                this.rentalsCharged = true;
                this.rentalList.forEach(rental => {
                  switch (rental.status) {
                    case STATUSCODE.firstContact:
                      this.rentalListFirstContact.push(rental);
                      break;
                    case STATUSCODE.over:
                      this.rentalListOver.push(rental);
                      if (this.needPayment(rental)) {
                        this.rentalListToBePaid.unshift(rental);
                      }
                      break;
                    case STATUSCODE.confirmed:
                      this.rentalListConfirmed.push(rental);
                      if (this.needPayment(rental)) {
                        this.rentalListToBePaid.push(rental);
                      }
                      break;
                    case STATUSCODE.option:
                      this.rentalListOption.push(rental);
                      break;
                    case STATUSCODE.canceled:
                      this.rentalListCanceled.push(rental);
                      break;
                    default:
                      break;
                  };
                })
                this.rentalListFirstContact.sort(
                  (a, b) => {return this._sortOnFirstDate(a,b);}
                );
                this.rentalListConfirmed.sort(
                  (a, b) => {return this._sortOnFirstDate(a,b);}
                );
                this.rentalListOption.sort(
                  (a, b) => {return this._sortOnFirstDate(a,b);}
                );
                this.rentalListOver.sort(
                  (a, b) => {return this._sortOnFirstDate(a,b);}
                );
                this.rentalListToBePaid.sort(
                  (a, b) => {return this._sortOnFirstDate(a,b);}
                );
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

  private _sortOnFirstDate(a: Rental, b: Rental) {
    let aDate = a.calendar_dates ? a.calendar_dates[0] ? a.calendar_dates[0] : '' : '';
    let bDate = b.calendar_dates ? b.calendar_dates[0] ? b.calendar_dates[0] : '' : '';
    if (aDate < bDate) return -1
    else if (aDate > bDate) return 1
    else return 0
  }

  private needPayment(rental: Rental): boolean {
    if (!rental.invoice) {
      return true;
    } else {
      if (rental.invoice.status != STATUSCODE.paid) {
        return true;
      }
    }
  }

  openNewRentalModal() {
    let modal = this.modalCtrl.create('NewRentalModalPage');
    modal.present();
    modal.onDidDismiss((newId) => {
      if (newId) {
        this.seeRentalDetails(newId);
      }});
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
