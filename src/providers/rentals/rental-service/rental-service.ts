//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { Rental } from "../../../models/rentals/rental.interface";
import { RentalConfig } from "../../../models/rentals/rentals-config.interface";
import { CategoryDetail } from "../../../models/rentals/category-detail.interface";
import { Quotation } from "../../../models/rentals/quotation.class";
import { RENTALS_MOCK } from "../../../mock_data/rentals/rentals_mock";
import { MOCK_RENTAL_CONFIG } from "../../../mock_data/rentals/config-rental_mock";
import { User } from '../../../models/global/user.interface';

/*
  Generated class for the RentalServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RentalServiceProvider {

  //Variable temporaire (MockingData)
  structId = 'struct1';

  config: RentalConfig;

  constructor() {
    console.log('Hello RentalServiceProvider Provider');
  }

  // CONFIG

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

  // QUOTATIONS

  
  
  /* MOCK DATA */
  
  // CONFIG
  /* 
    Renvoi les options de config pour les location - filtré sur l'Id de la structure (pour l'instant, il n'y a qu'une structure que je choisis ici par défaut) 
    return Observable
  */
  mockGetOptionsByKey(config_key) : Observable<RentalConfig> {
    return Observable.of(MOCK_RENTAL_CONFIG.filter(config => config.key === config_key)[0]);
  }


  // RENTALS
  /* 
    Renvoi un tableau de Rental - Mock Data N'applique aucun filtre
    return Observable
  */
  mockGetRentalsInformation(structKey: string): Observable<Rental[]> {
    return Observable.of(RENTALS_MOCK.filter(rental => rental.struct_key === structKey));
  }
  
  /* 
    Renvoi un tableau de Rental - Mock Data Filtré sur le nom name
    return Observable
  */
  mockGetRentalDetails(id:any): Observable<Rental> {
    return Observable.of(RENTALS_MOCK.filter(rental => rental.id === id)[0]);
  }

  /* END OF MOCK DATA */
}
