//import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/map';

import { Rental } from "../../../models/rentals/rental.interface";
import { RentalConfig } from "../../../models/rentals/rentals-config.interface";
import { CategoryDetail } from "../../../models/rentals/category-detail.interface";
//import { Quotation } from "../../../models/rentals/quotation.class";
import { RENTALS_MOCK } from "../../../mock_data/rentals/rentals_mock";
import { MOCK_RENTAL_CONFIG } from "../../../mock_data/rentals/config-rental_mock";
//import { User } from '../../../models/global/user.interface';
//import { UserServiceProvider } from '../../global/user-service/user-service';
import { StructureServiceProvider } from '../../global/structure-service/structure-service';
import { MODULES_KEYS } from '../../global/modules/modules';
import { LogController } from '../../../controllers/log.controller';
import { QuotationArgs } from '../../../models/rentals/quotation.class';
//import { RentalLastLogComponent } from '../../../components/rentals/rental-last-log/rental-last-log';

//Angularfire2
import{
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth'

// import * as firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
import { Moduleconfig } from '../../../models/global/module-config.interface';

/*
  Generated class for the RentalServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RentalServiceProvider {

  //Variable temporaire (MockingData)
  structId = 'struct1';

  module_key = MODULES_KEYS.rental;
  config: RentalConfig;
  
  //rentalsPath: AngularFirestoreCollection<Rental> = this.angularFirestore.collection('rentals');
  rentals$ : Observable<Rental[]>;

  // AngularFireé Observable
  public rentalsList: AngularFirestoreCollection<Rental>;
  public rental$: AngularFirestoreDocument<Rental>;
  
  sortedByCategoryPriceList : Array<CategoryDetail>;


  constructor(
    private struct : StructureServiceProvider, 
    private logCtrl : LogController,
    private afAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore ) {
    console.log('Hello RentalServiceProvider Provider');
      // this.afAuth.authState.subscribe( user => {
      //   if ( user ) {
      //     this._setRentals().then(
      //       () => console.debug('list de location chargée'),
      //       (e) => console.debug('listes de locations non chargée : ' + e)
      //     )
      //   }
      // })


    // firebase.auth().onAuthStateChanged( (user) => {
    //   if (user) {
    //     this._setConfig().then(() => {
    //       if (this.config) {
    //         console.debug(`config chargée : ${this.config}`);
    //         // this.rentalsPath = firebase.firestore().collection(`/rentals/`);
    //       }
    //     });
    //   }
    // })
  }

  // CONFIG

    /**
     * Deprecated ?
     * @param config 
     */
  getPriceOptionsList(config: RentalConfig) : Array<CategoryDetail> {
    var priceOptionsList : Array<CategoryDetail> = [];
    config.categories.forEach(cat => {
      // console.log('in the loop getPricesOptionsList');
      // console.log(cat);
      var category : CategoryDetail = {};
      category.catName = cat.label;
      category.pricesList = [];
      config.options.forEach(option => {
        if(option.catId === cat.id){
          category.pricesList.push(option);
        }
      });
      priceOptionsList.push(category);
    })
    return priceOptionsList;
  }

  /**
   * Get the Option price list sorted by category, it's an array of arrays
   * @returns Array<CategoryDetail>
   */
  getSortedByCategoryPriceList() : Array<CategoryDetail> {
    this.sortedByCategoryPriceList = [];
    this.config.categories.forEach( cat => {
      var category : CategoryDetail = {
        catName : cat.label,
        pricesList : [],
      };
      this.config.options.forEach(option => {
        if(option.catId == cat.id) {
          category.pricesList.push(option);
        }
      })
      this.sortedByCategoryPriceList.push(category);
    });
    return this.sortedByCategoryPriceList;
  }

  // QUOTATIONS
  /**
   * Compare to QuotationAg and return true if they are fully the same
   * Some comparaisons are missing, should be easier to keep a track of the change in the QuotationDashPage...
   * @param args1 QuotationArg
   * @param args2 QuotationARg
   */
  compareQuotationArgs(args1: QuotationArgs, args2: QuotationArgs): boolean{
    //let answer = true;
    // compare discount & status code
    if ( args1.discount != args2.discount 
      || args1.statusCode != args2.statusCode) {
        console.warn('discount or status different');
        return true;
      }
      
    //compare total
    if ( args1.total.amount != args2.total.amount
      || args1.total.cost != args2.total.cost) {
        console.warn('total different');
        return true 
      }
        
    // compare Details
    if ( args1.details && args2.details) {
      if ( args1.details.length != args2.details.length ) {
        console.warn('details different');
        return true
      }
    }

    // Compare Verbose
    if (args1.verbose && args2.verbose) {
      if (args1.verbose.amount != args2.verbose.amount
          || args1.verbose.discount != args2.verbose.discount) {
            console.warn('verbose different');
            return true;
          }
    }
    return false;
  }
  

  getLocationLabel(locId) {
    return this.config.locations.find((loc)=>loc.id === locId).label;
  }
  
  /* MOCK DATA */
  
  // CONFIG

  /**
   * Set the Config Option for the loaded structure
   */
  private async _setConfig(): Promise<void> {
    await this.struct.getStructureModuleConfigBykey(this.module_key).then( 
      (config) => {
        if (config) {
          this.config = <RentalConfig>config;
        }
      }
    );
  }
  
  /**
   * Get the Rental config for the loaded structure
   * @returns RentalConfig
   */
  public getConfig() : RentalConfig {
    return this.config;
  }

  public async loadConfig() {
    this.afAuth.authState.subscribe( (user) => {
      if (user) {
        this._setConfig().then(() => {
          if (this.config) {
            console.debug(`config chargée : ${this.config}`);
            // this.rentalsPath = firebase.firestore().collection(`/rentals/`);
          }
        });
      }
    })
  }

  public isConfigLoaded() : boolean {
    return (this.config)?true:false;
  }

  public async updateConfig(config: RentalConfig) {
    return await this.struct.updateStructureModuleConfig(this.module_key, config);
  }

  /**
   * Set the rentals Array<Rentals> for the loaded structure
   */
  private async _setRentals() : Promise<void> {
    return await this.struct.getCurrentId()
      .then(
        (id) => {
          this.rentalsList = this.angularFirestore.collection('rentals',
            ref => ref.where('struct_key', '==', id));
        }
      )
      .catch(
        (e) => {
          console.warn("Impossible de récupérer l'id : " + e)
        }
      )
  }

  /**
   * Get the Rentals for the loaded structure
   * @returns the rentals as a promise of AngularFiresoreCollection<Rental>
   */
   async getRentals(): Promise<AngularFirestoreCollection<Rental>> {
      // a async wait this.struct.getCurrentId()
      //   .then(
      //     (id) => {
      //       console.log(`Struct key for the rentals to retrieve : ${id}`);
      //       this.rentalsList = this.angularFirestore.collection('rentals', ref => ref.where('struct_key', '==', id ));
      //     }
      //   )
      //   .catch(
      //     (e) => {
      //       console.warn(e);
      //     }
      //   )
      if (! this.rentalsList) {
        return this._setRentals().then(
          () => {
            return this.rentalsList;
          }
        );
      }
      return this.rentalsList;
  }

  async getRentalscount(): Promise<number> {
    return this.rentalsList.ref.get().then(
      (data) => {
        return data.size;
      }
    )
  }

  /**
   * Get the specified Rental of id rentalID
   * @param rentalID
   * @returns AngularFirestoreDocument<Rental>
   */
  getRentalDetails(rentalID: string) : AngularFirestoreDocument<Rental> {
    return this.angularFirestore.doc(`rentals/${rentalID}`);
  }


  /**
   * Add a rental in DB
   * @param rental : Rental
   * @returns true if everything went fine, false otherwise
   */
  async addRental(rental: Rental) : Promise<string | boolean> {
    if (!this.rentalsList) {
      await this._setRentals();
    }
    const newRentalRef: firebase.firestore.DocumentReference = await this.rentalsList.add(rental);
    return newRentalRef.update({
      id: newRentalRef.id,
    }).then(
        () => {return newRentalRef.id},
      ).catch(
        (e) => {
          console.warn(e);
          return false
        }
      )
  }

  /**
   * Delete the rental of id rentalID in DB
   * @param rentalID 
   * @returns true if everything went fine, false otherwise
   */
  async deleteRental(rentalID: string) : Promise<boolean> {
    return this.rentalsList.doc(rentalID).delete()
      .then(
        () => { return true},
      )
      .catch(
        (e) => {
          console.warn(e);
          return false
        }
      );
  }

  /**
   * Do I need an update function ?
   * @param rentalID the id of the rental to update
   * @param rentalData the Rental object to pass as update
   * @returns true if everythong went right, false otherwise
   */
  async updateRental(rentalID: string, rentalData: Rental): Promise<boolean> {
    if (! this.rentalsList ) {
      await this._setRentals();
    }
    return this.rentalsList.doc(rentalID).update(rentalData)
      .then(
        () => {return true}
      )
      .catch(
        (e) => {
          console.warn(e);
          return false
        }
      )
  }

  /**
   * RENTAL CONTRACTS
   */

   public prefillContract(rental: Rental): void {
     // Dates, locations and  schedule ?
     // Tech ?
     
     // Promo ?

     // openToPublic ?

     // receptionStaff ?

     // ticketting ?

     // ticketStaff ?

     // bar ?

     // techList ?

   }

  /**
   * 
   * @param structKey 
   */
  async log(rental, automatedMsg: string = '', msg:string = '') : Promise<void> {
    await this.logCtrl.log(rental, automatedMsg, msg);
  }
  /******************************************************************
   * 
   * 
   * OLD FUNCTIONS
   */

  



  

  


  // RENTALS
  /* 
    Deprecated ?
    return Observable
  */
  // mockGetRentalsInformation(structKey: string): Observable<Rental[]> {
  //   return Observable.of(RENTALS_MOCK.filter(rental => rental.struct_key === structKey));
  // }
  
  /* 
    Deprecated ?
    Renvoi un tableau de Rental - Mock Data Filtré sur le nom name
    return Observable
  */
  // mockGetRentalDetails(id:any): Observable<Rental> {
  //   return Observable.of(RENTALS_MOCK.filter(rental => rental.id === id)[0]);
  // }
  
    /* 
    Deprecated ?
    return Observable
  */
//  mockGetOptionsByKey(config_key) : Observable<RentalConfig> {
//   return Observable.of(MOCK_RENTAL_CONFIG.filter(config => config.key === config_key)[0]);
// }
//   /* END OF MOCK DATA */
}
