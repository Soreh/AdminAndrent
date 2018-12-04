//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

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

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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
  config$: RentalConfig;
  rentals$ : Observable<Rental[]>;
  sortedByCategoryPriceList : Array<CategoryDetail>;


  constructor(private struct : StructureServiceProvider, private logCtrl : LogController ) {
    console.log('Hello RentalServiceProvider Provider');
    this.config$ = <RentalConfig>this.struct.getModuleConfig(this.module_key);
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
    this.config$.categories.forEach( cat => {
      var category : CategoryDetail = {
        catName : cat.label,
        pricesList : [],
      };
      this.config$.options.forEach(option => {
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
  

  
  /* MOCK DATA */
  
  // CONFIG
  /* 
    Deprecated ?
    return Observable
  */
  mockGetOptionsByKey(config_key) : Observable<RentalConfig> {
    return Observable.of(MOCK_RENTAL_CONFIG.filter(config => config.key === config_key)[0]);
  }

  /**
   * Set the Config Option for the loaded structure
   */
  private _setConfig() : void {
    // if(this.struct.getDefaultStructure()){
    //   let key = this.struct.getDefaultStructure().modules.filter(mod => mod.module_key == this.module_key)[0].config_key;
    //   Observable.of(MOCK_RENTAL_CONFIG.filter(config => config.key == key)[0]).subscribe(config => this.config$ = config);
    // }
  }
  
  /**
   * Get the Config Options for the loaded structure
   * @returns RentalConfig as a susbcription
   */
  getConfig() : RentalConfig {
      this._setConfig();
    return this.config$;
  }

  /**
   * Set the rentals Array<Rentals> for the loaded structure
   */
  private _setRentals() : void {
    //let key = this.struct.getDefaultStructure().key;
    // this.rentals$ = Observable.of(RENTALS_MOCK.filter(rental => rental.struct_key == key));
  }

  /**
   * Get the Rental[] for the loaded structure
   * @returns Rental[] as a subscription
   */
  getRentals() : Observable<Rental[]> {
    this._setRentals();
    return this.rentals$;
  }

  /**
   * Add a rental to the rentals$ array of the loaded structure
   * @param rental 
   */
  addRental(rental: Rental) : void {
    rental.id = "test" + Math.random(); // WARNING ! I HAVe TO RETRIEVE THE KEY FROM DB
    RENTALS_MOCK.unshift(rental);
  }

  /**
   * Delete the rental of id rentalID in DB
   * @param rentalID 
   */
  deleteRental(rentalID) : void {
    // let rentalDeleted = RENTALS_MOCK.splice(this.rentals$.findIndex(rental => rental.id === rentalID), 1);
    // console.warn(rentalDeleted);
  }

  /**
   * Get the specified Rental of id rentalID
   * @param rentalID
   * @returns Rental
   */
  getRentalDetails(rentalID) : Rental {
    if( !this.rentals$ ){
      console.error("No rentals loaded... Try to invoke getRentals() first")
    } else {
      let result;
      Observable.of(RENTALS_MOCK.filter(rental => rental.id === rentalID)[0]).subscribe(rental => result = rental);
      return result;
    }

    //return this.rentals$.filter(rental => rental.id == rentalID)[0];
  }

  /**
   * 
   * @param structKey 
   */
  log(rental, automatedMsg: string = '', msg:string = '') : void {
    this.logCtrl.log(rental, automatedMsg, msg);
  }

  // RENTALS
  /* 
    Deprecated ?
    return Observable
  */
  mockGetRentalsInformation(structKey: string): Observable<Rental[]> {
    return Observable.of(RENTALS_MOCK.filter(rental => rental.struct_key === structKey));
  }
  
  /* 
    Deprecated ?
    Renvoi un tableau de Rental - Mock Data Filtré sur le nom name
    return Observable
  */
  mockGetRentalDetails(id:any): Observable<Rental> {
    return Observable.of(RENTALS_MOCK.filter(rental => rental.id === id)[0]);
  }

  /* END OF MOCK DATA */
}
