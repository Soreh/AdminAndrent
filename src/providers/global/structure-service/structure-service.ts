import { Injectable } from '@angular/core';

import { MOCK_STRUCTURES } from "../../../mock_data/global/structures_mock";
import { Observable } from 'rxjs/Observable';
import { Structure } from '../../../models/global/structure.interface';
import { UserServiceProvider } from '../user-service/user-service';
import { UserProfile } from '../../../models/global/user-profile.interface';

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import { User } from "firebase/app";

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { convertUrlToSegments } from 'ionic-angular/umd/navigation/url-serializer';
import { Moduleconfig } from '../../../models/global/module-config.interface';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

/*
  Generated class for the StructureServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StructureServiceProvider {

  connectedUser : UserProfile;
  structures: Structure[];
  activeStructure$: Structure;
  activeModules;

  structuresList: firebase.firestore.CollectionReference;
  activeStructure: firebase.firestore.DocumentReference;
  currentStructureId : string;
  userStructures: firebase.firestore.CollectionReference;

  currentStructure: Structure;
  //currentStructureId: string;

  constructor(private userService: UserServiceProvider, private db: AngularFireDatabase) {
    console.log('Hello StructureServiceProvider Provider');
    // this.setUser();
    firebase.auth().onAuthStateChanged( user => {
      if ( user ) {
        this.structuresList = firebase.firestore().collection('/structures');
        this.userStructures = this.userService.getUserStructures();
      }
    })
  }

  async addStructure(structure: Structure, isDefault: boolean): Promise<any> {
    let structAdded = false;
    let userUpdated = false;
    let errorMsg: string = '';
    await this.structuresList.add(structure)
    .then( 
      async (doc) => {
        if (doc) {
          //await doc.update({key: doc.id});
          structAdded = true;
          await this.userStructures.add({name: structure.name, key: doc.id, isDefault: isDefault}).then(
            ( doc ) => {
              if (doc) {
                userUpdated = true;
              } else {
                console.warn('Could not add the object in the structure collection :(');
              }
            },
            ( error ) => errorMsg += ` Could not add the object in the structure collection :( `,
          );
        } else {
          console.warn('Could not add the structure :(');
        }
      },
      ( error ) => errorMsg += ` Could not add the structure :( `,
    )
    .then( () => {
      return new Promise((resolve, reject) => {
        if (!structAdded || !userUpdated ) {
          console.error(errorMsg);
          resolve(false);
        } else {
          console.debug('Structure and strcut_meta added')
          resolve(true);
        }
      })
    });
  }

  // Pas sur que ça marche... a essayer plus tard
  public async updateStructure(key: any, structure: Structure): Promise<any> {
    return await firebase.firestore().doc(`/structures/${key}`).update(structure);
  }
  
  /**
   * Return the detail of the structure and set the current structure id
   * on the go.
   * @param structKey 
   */
  public async getStructureDetails(structKey: string): Promise<Structure | boolean> {
    return await firebase.firestore().doc(`/structures/${structKey}`).get()
    .then( (struct) => {
        if (struct) {
          // console.log(struct.data());
          //this.setCurrentStructure(<Structure>struct.data());
          this.currentStructureId = struct.id; // Could be structKey ?
          return <Structure>struct.data();
        } else {
          return false
        }
    });
  }

  public setCurrentStructure(structure: Structure): void {
    this.currentStructure = structure;
  }

  public getCurrentStructure(): Promise<firebase.firestore.DocumentReference> {
    return this.isStructureLoaded().then( (ok) => {
      if (ok) {
        return firebase.firestore().doc(`/structures/${this.currentStructureId}`)
      }
    })
  }

  public getCurrentId(): Promise<any> {
    return this.isStructureLoaded().then( (ok) => {
      return this.currentStructureId;
    })
  }

  public isStructureLoaded(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.currentStructureId) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
  }

  public getModuleConfig(module_key: string): Promise<Moduleconfig> {
    return this.getCurrentStructure().then( (ref) => {
      ref.get().then((snap) => {
        let data = <Structure>snap.data();
        let config = <ModuleConfig>data.modules.filter(mod => mod.module_key === module_key)[0].config;
        return config;
      } )
    })
    // return this.currentStructure.modules.filter(mod => mod.module_key === module_key)[0].config;
  }


  /* OLD FUNCTIONS */

  /**
   * 
   * Setters
   */

  private setUser() : void {
    this.connectedUser = this.userService.getConnectedUser();
  }

  private setStructures() : void {
    this.structures = [];
    if(this.userService.getConnectedUser().structures){
      this.userService.getConnectedUser().structures.forEach(structure => {
        this.structures.push(MOCK_STRUCTURES.filter( struct => 
          struct.key === structure.key)[0]);
      });
      console.log(this.structures);
    } else {
      console.error('No user...')
    }

  }
  
  private setActiveStructure() : void {
    if(this.userService.getConnectedUser()){
      if(this.userService.getConnectedUser().structures){
        let default_struct_key = this.userService.getConnectedUser().structures.find(struct => struct.isDefault).key;
        console.log(default_struct_key);
        // We fetch the data
        const struct_data = this.db.object(`structures/${default_struct_key}`);
        console.log(struct_data);
        Observable.of(MOCK_STRUCTURES.filter(struct => struct.key === default_struct_key)[0]).subscribe( structure =>
          this.activeStructure$ = structure,
        )
        console.log(this.activeStructure$);
      }
    } else {
      console.error('No user...')
    }
  }

  private setActiveModules() : void {

  }

  getDefaultStructure( user : UserProfile ) {
    let struct = user.structures.findIndex(struct => struct.isDefault);
    let path = this.db.object(`structures/${user.structures[struct].key}`);
    return path.valueChanges();
  }

  /**
   * 
   * Getters DEPRECATAED ?
   */

  getDefaultStructureOLD() : Structure {
    this.setActiveStructure();
    return this.activeStructure$;
  }

  getStructures() : Structure[] {
    this.setStructures();
    return this.structures;
  }

  /**
   * Deprecated ?
   * @param key 
   */
  getStructureByKey(key) : Observable<Structure> {
    this.activeStructure$ = MOCK_STRUCTURES.filter(struct => struct.key === key)[0];
    return Observable.of(this.activeStructure$);
  }

  /**
   * Deprecated ?
   * @param keys
   */
  getStructuresByKeys(keys : Array<any>) : Observable<Structure[]> {
    keys.forEach(key => {
      this.structures.push(MOCK_STRUCTURES.filter(struct => struct.key === key.key)[0]);
    });
    return Observable.of(this.structures);
  }
  
  /**
   * Deprecated ?
   */
  getLoadedStructureKey() : string {
    return this.activeStructure$.key;
  }

  /**
   * Deprecated ?
   */
  getStructureModules() {
    return this.activeStructure$.modules;
  }

  /**
   * Save the Structure in Firebase DB
   * @param structure 
   * @returns true if everything went fine :) 
   */
  async saveStructure(structure: Structure) : Promise<string>{
    let data = this.db.list('structures')
    // let data = this.db.object(`/structures/`);
    // this.db.
    try {
      const id = this.db.createPushId();
      console.log("pushid : " + id);
      console.log(structure);
      await data.set(id, structure);
      //await data.set(structure);
      return id;
    } catch (e) {
      console.error(e.message);
    }
  }

//   addStructure(structure: Structure, isDefault = false) : void {
//     // if (!this.structures){
//     //   this.structures = [];
//     // }
//     // this.structures.push(structure);
//     // Adding the structure in the DataBase

//     // create a DefaultConfig pour chaque module
//     // recupérer la clef et la stocker dans la structure

   
//     // ajouter la structure dans la DB
//     MOCK_STRUCTURES.push(structure);

//     // récupérer la clef et la stocker ajouter la structure à la liste des structures de l'utilisateur connecté.
//     this.userService.addStructure(structure.key, isDefault);
//     // if (!this.userService.getConnectedUser().structures){
//     //   this.userService.getConnectedUser().structures = [];
//     // }
//     // this.userService.getConnectedUser().structures.push(
//     //   {
//     //     key : structure.key,
//     //     isDefault : isDefault
//     //   }
//     // );
//     // console.log(this.userService.getConnectedUser());
//   }

}
