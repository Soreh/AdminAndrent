import { Injectable } from '@angular/core';
import { Structure } from '../../../models/global/structure.interface';

/*
  Generated class for the ModulesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ModulesProvider {

  modulesToLoad = [];

  constructor() {
  }

  getModulesToLoadList(structure : Structure)  {
    this.modulesToLoad = [];
    structure.modules.forEach(m => {
      this.modulesToLoad.push(MODULES.filter(module => module.key === m.module_key)[0]);
    });
    return this.modulesToLoad;
  }

}

export const MODULES_KEYS = {
  location : 'module_1',
  contracts : 'module_2',
  invoices : 'module_3',
  accountability : 'module_4',
}

export const MODULES = [
  {
    key : MODULES_KEYS.location,
    name : 'Locations', // Traduction ?
    page : 'RentalsPage',
  },
  {
    key : MODULES_KEYS.contracts,
    name : 'Contrats', // Traduction ?
    page : 'RentalsPage',
  },
  {
    key : MODULES_KEYS.invoices,
    name : 'Factures', // Traduction ?
    page : 'RentalsPage',
  },
  {
    key : MODULES_KEYS.accountability,
    name : 'Compta', // Traduction ?
    page : 'RentalsPage',
  },
]



