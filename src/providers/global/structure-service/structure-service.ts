import { Injectable } from '@angular/core';
import { Structure } from '../../../models/global/structure.interface';
import { UserServiceProvider } from '../user-service/user-service';
import { UserProfile } from '../../../models/global/user-profile.interface';

import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase } from "@angular/fire/database";

import { Moduleconfig } from '../../../models/global/module-config.interface';

import{
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

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

  structuresList: AngularFirestoreCollection;
  activeStructure: AngularFirestoreDocument<Structure>;
  
  currentStructureId : string;
  currentStructure: Structure;

  userStructures: AngularFirestoreCollection;

  //currentStructureId: string;

  constructor(
    private userService: UserServiceProvider, 
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore) {
    this.afAuth.auth.onAuthStateChanged( user => {
      if ( user ) {
        this.structuresList = this.afStore.collection('/structures');
        this.userStructures = this.userService.getUserStructures();
      }
    }) 
  }

  // public destroyCurrentStructureID(): void {
  //   this.currentStructureId = null;
  // }

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
      ( error ) => errorMsg += ` ${error} : Could not add the object in the structure collection :( `,
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
  public async updateCurrentStructure(structure: Structure): Promise<any> {
    return await this.afStore.doc(`/structures/${this.currentStructureId}`).update(structure);
  }
  
  /**
   * Return the detail of the structure and sets the current structure id
   * on the go.
   * @param structKey 
   */
  public async getStructureDetails(structKey: string): Promise<Structure> {
    console.debug();
    this.activeStructure = this.afStore.doc(`/structures/${structKey}`);
    return await this.activeStructure.ref.get().then(
      (snap) => {
        let struct = <Structure>snap.data();
        this.currentStructureId = snap.id;
        console.debug(this.currentStructureId);
        this.currentStructure = struct;
        return this.currentStructure;
      } 
    )
  }

  public setCurrentStructure(structure: Structure): void {
    this.currentStructure = structure;
  }

  public async getCurrentStructure(): Promise<AngularFirestoreDocument> {
    return await this.isStructureLoaded().then(
      (ok) => {
      if (ok) {
        console.debug('got the Doc Ref !');
        return this.afStore.doc(`/structures/${this.currentStructureId}`);
      }
    });
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

  /**
   * To verify if a structure exists un DB
   * @param structure_key
   * @returns true if it does
   */
  public async structureExists(structure_key) : Promise<Boolean> {
    return await this.afStore.doc(`/structures/${structure_key}`).ref.get().then(
      (snap) => {
        if(snap.exists){
          console.debug(snap);
          return true
        }
        else {
          return false
        }
      },
      (error) => {
        console.error(error);
        return false
      }
    )
  }

  /**
   * 
   * @param module_key the module key as stored in MODULES_KEY
   * @returns the module config for the loaded structre, or false if it fails
   */
  public async getStructureModuleConfigBykey(module_key: string): Promise<Moduleconfig | boolean> {
    console.debug(this.currentStructureId);
    return await this.getCurrentStructure()
    .then(
      async (doc) => {
        if( doc ) {
          return await doc.ref.get()
          .then(
            async (snap) => {
              let struct = await <Structure>snap.data();
              let data = struct.modules.filter(mod => mod.module_key === module_key)[0].config;
              console.debug(data);
              return data
            },
            () => {
              return false
            }
          )
        }
      }, 
      () => {
        return false
      }
    );
  }

  public async updateStructureModuleConfig(module_key: string, config: Moduleconfig) {
    return await this.getCurrentStructure().then(
      async (doc) => {
        if (doc) {
          await doc.ref.get().then(
            async (snap) => {
              let struct = await <Structure>snap.data();
              struct.modules.find(mod => mod.module_key === module_key).config = config;
              doc.set(struct);
            }
          )
        }
      }
    )
  }


  /* OLD FUNCTIONS */

  /**
   * 
   * Setters
   */

  private setStructures() : void {

  }
  
  private setActiveStructure() : void {

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
      await data.set(id, structure);
      //await data.set(structure);
      return id;
    } catch (e) {
      console.error(e.message);
    }
  }

}
