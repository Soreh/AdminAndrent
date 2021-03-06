import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';

/*
  Generated class for the ModulesProvider provider. 

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ModulesProvider {

  modulesToLoad = [];

  constructor(private db : AngularFireDatabase) {
  }

  /**
   * 
   * @param structure$ Structure
   * @returns the modules list
   */
  // getModulesToLoadList(structure$ : Structure)  {
  //   this.modulesToLoad = [];
  //   structure$.modules.forEach(m => {
  //     let module = MODULES.filter(module => module.key === m.module_key)[0];
  //     module.config_key = m.config_key;
  //     this.modulesToLoad.push(module);
  //   });
  //   return this.modulesToLoad;
  // }

  getModuleName(module_key) : string {
    return MODULES.filter(mod => mod.key == module_key)[0].name;
  }

  getModulePage(module_key): string {
    return MODULES.filter(mod => mod.key === module_key)[0].page;
  }

  createDefaultRentalConfig(): RentalConfig {
    const cat1Id = this.db.createPushId();
    const chargeType1Id = this.db.createPushId();
    const chargeDetail1Id = this.db.createPushId();
    //let data = this.db.list(MODULES_KEYS.rental);
    return {
      categories : [
        {
            id : cat1Id,
            label : "Categorie 1",
        }
      ],
      options : [
        {
          id : this.db.createPushId(),
          label : 'Option 1',
          catId : cat1Id,
          amount : 0,
          cost : 0,
          isCompulsory : true,
          chargeId : chargeDetail1Id,
          unit: 0,
        }
      ],
      locations : [
        {
          id : 1,
          label : "Salle 1",
        }
      ],
      chargesTypes : [
            {
              isCompulsory : true,  
              id : chargeType1Id,
              label : 'Coûts de type 1',
              chargesId : [chargeDetail1Id], // je reprends ici la liste des coûts, ça redouble l'information, mais ça peut faciliter le tri, mai sbon du coup chargestype et chargesTypeDetails sont interconnectés, pas sur que ce soit une bonne idée.
            },
        ],
      chargesTypeDetails : [
            {
                id: chargeDetail1Id,
                label : "Aucun coût",
                amount : 0,
                cost : 0,
                chargeTypeId : chargeType1Id,
            }
        ],
    }

    // let path = this.db.object(`config/${id}`);
    // try {
    //   const data = await path.set(defaultConfig);
    //   return id;
    // } catch (error) {
    //   console.error(error.message);
    // }
  }

}

export const MODULES_KEYS = {
  rental : 'module_1',
  contracts : 'module_2',
  invoices : 'module_3',
  accountability : 'module_4',
}

export const MODULES = [
  {
    key : MODULES_KEYS.rental,
    name : 'Locations', // Traduction ?
    page : 'RentalCalendarPage',
    config_key : '',
  },
  {
    key : MODULES_KEYS.contracts,
    name : 'Contrats', // Traduction ?
    page : 'RentalsPage',
    config_key : '',
  },
  {
    key : MODULES_KEYS.invoices,
    name : 'Factures', // Traduction ?
    page : 'RentalsPage',
    config_key : '',
  },
  {
    key : MODULES_KEYS.accountability,
    name : 'Compta', // Traduction ?
    page : 'RentalsPage',
    config_key : '',
  },
]



