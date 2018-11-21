import { Injectable } from '@angular/core';

import { MOCK_STRUCTURES } from "../../../mock_data/global/structures_mock";
import { Observable } from 'rxjs/Observable';
import { Structure } from '../../../models/global/structure.interface';
import { UserServiceProvider } from '../user-service/user-service';
import { User } from '../../../models/global/user.interface';

/*
  Generated class for the StructureServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StructureServiceProvider {

  connectedUser : User;
  structures: Structure[] = [];
  activeStructure: Structure;
  activeModules;

  constructor(private userService: UserServiceProvider) {
    console.log('Hello StructureServiceProvider Provider');
  }

  /**
   * 
   * Setters
   */

  private setUser() : void {

  }

  private setStructures() : void {

  }

  private setActiveStructure() : void {

  }

  private setActiveModules() : void {

  }

  /**
   * 
   * Getters
   */

  getStructureByKey(key) : Observable<Structure> {
    this.activeStructure = MOCK_STRUCTURES.filter(struct => struct.key === key)[0];
    return Observable.of(this.activeStructure);
  }

  getStructuresByKeys(keys : Array<any>) : Observable<Structure[]> {
    keys.forEach(key => {
      this.structures.push(MOCK_STRUCTURES.filter(struct => struct.key === key.key)[0]);
    });
    return Observable.of(this.structures);
  }
  
  getLoadedStructureKey() : string {
    return this.activeStructure.key;
  }

  getStructureModules() {
    return this.activeStructure.modules;
  }



  addStructure(structure: Structure, isDefault = true) : void {
    this.structures.push(structure);
    if (!this.userService.getConnectedUser().structures){
      this.userService.getConnectedUser().structures = [];
    }
    this.userService.getConnectedUser().structures.push(
      {
        key : structure.key,
        isDefault : isDefault
      }
    );
    console.log(this.userService.getConnectedUser());
  }

}
