import { Injectable } from '@angular/core';
import { UserProfile } from '../../../models/global/user-profile.interface';
import { Observable } from 'rxjs/Observable';

//Angularfire2
import{
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth'

import { AngularFireDatabase } from "@angular/fire/database";
import { Subscription } from 'rxjs';

/*
  Generated class for the UserServiceProvider provider. 

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  user: UserProfile;

  connectedUser$ : Observable<UserProfile>;
  connectedUser : UserProfile;

  profile$ : Subscription;
  profile : UserProfile;

  currentUser : firebase.User;
  userProfile : AngularFirestoreDocument<UserProfile>;
  userStructures: AngularFirestoreCollection;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private firestore: AngularFirestore
    ) {
      this.afAuth.auth.onAuthStateChanged( user => {
        if (user) {
          this.currentUser = user;
          this.userProfile = this.firestore.doc(`/userProfiles/${user.uid}`);
          //this.userProfile = firebase.firestore().doc(`/userProfiles/${user.uid}`);
          this.userStructures = this.firestore.collection(`/userProfiles/${user.uid}/structures/`)
          //this.userStructures = firebase.firestore().doc(`/userProfiles/${user.uid}`).collection('/structures/');
        }
      })
  }

  /**
   * 
   */
  getUserProfile(): AngularFirestoreDocument<UserProfile> {
    return this.userProfile;
  }

  public async getUserName() : Promise<string> {
    await this.userProfile.ref.get().then(
      (snap) => {
        this.profile = <UserProfile>snap.data();
      },
      (e) => {
        console.warn(e);
      }
    )
    if (this.profile.name) {
      return this.profile.name;
    } else {
      return "J'ai toujours pas de pseudo..." 
    }
  }

  /**
   * 
   */
  getCurrentUser(): firebase.User {
    return this.currentUser;
  }

  /**
   * 
   */
  getUserStructures(): AngularFirestoreCollection {
    return this.userStructures;
  }

  /**
   * 
   */
  createUserProfile(): Promise<any> {
    return this.userProfile.set({mail: this.currentUser.email, key: this.currentUser.uid});
  }

  /**
   * 
   * @param pseudo 
   */
  updatePseudo(pseudo : string): Promise<any> {
    return this.userProfile.update({
      name : pseudo,
    })
  }

  linkStructure(struct_key, main: boolean): Promise<any> {
    return this.userStructures.add({
      isDefault: main,
      key: struct_key,
    })
  }

  /**
   * 
   * @param newEmail
   * @param password
   */
  updateMail(newEmail: string, password: string): Promise<void> {
    throw new Error("not implemented yet ;)");
  }

 
  

  /**
   * Login and authentificate on Firebase
   * @param email login email
   * @param password 
   */
  // async login(email: string, password: string) : Promise<LoginResponse> {
  //   let ok = false;
  //   try {
  //     const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  //     //console.log(result.user.uid);
  //     this.profile$ = await this.db.object(`/profiles/${result.user.uid}`).valueChanges().subscribe(
  //       res => this.profile = res, 
  //       e => console.log(e),
  //       () => {
  //         console.log(this.profile);
  //       }
  //       );
        
  //     return {
  //       uid : this.profile.key,
  //     }
  //     // try {
  //     //   const response = await this._getProfile(result.user).then(profile =>
  //     //     {
  //     //       this.profile = profile;
  //     //       console.log(this.profile);
  //     //       return {
  //     //         uid : this.profile.key,
  //     //       }
  //     //     });
  //     //   //console.log(this.profile);
  //     //   // if ( !this.profile ){
  //     //   //   this.profile = {
  //     //   //     name : result.user.displayName,
  //     //   //     key : result.user.uid,
  //     //   //     email : result.user.email,
  //     //   //   }
  //     //   // }
        
  //     // } catch (e) {
  //     //   console.warn(e.message);
  //     // }
  //     //console.log(this.connectedUser$);
  //   } catch (e) {
  //     console.error(e);
  //     return {
  //       error : {
  //         code: e.code,
  //         msg: e.message,
  //       }
  //     }
  //   }
  // }

  // async _getProfile(user: User) : Promise<UserProfile> {
  //   //let profile : UserProfile;
  //   this.profile$ = await this.db.object(`/profiles/${user.uid}`).valueChanges().subscribe( res => {
  //     if (res) {
  //       this.profile = res;
  //     } else {
  //       this.profile = {
  //         name : user.displayName,
  //         email : user.email,
  //         key : user.uid,
  //       }
  //     }
  //     console.log(this.profile);
  //   });
  //   return this.profile as Promise<UserProfile>;
  // }

  async updateProfile(uid, field, data, isList = true) {
    try {
      if (isList) {
        const result = await this.db.list(`profiles/${uid}/${field}`).push(data);
        console.debug(result);
      } else {
        const result = await this.db.object(`profiles/${uid}/${field}`).update(data);
        console.debug(result);
      }
      return true;
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }

  getProfile(uid)  {
    // if (!this.connectedUser$){
    //   this.connectedUser$ = await this.db.object(`profiles${uid}`).valueChanges();
    // }
    this.connectedUser$ = this.db.object(`profiles/${uid}`).valueChanges();
    return this.connectedUser$;
  }

  async getProfileOLD(uid: string) : Promise<UserProfile> {
    if (!this.connectedUser) {
      const saved = await this._setProfile(uid);
      if ( saved ) {
        return this.connectedUser
      };
    } else {
      return this.connectedUser;
    }
  }

  private _setProfile(uid: string) {
    try {
      this.connectedUser$ = this.db.object(`profiles/${uid}`).valueChanges();
      this.connectedUser$.subscribe(res => 
        {
          this.connectedUser = res;
          return true
        });
    } catch(e) {
      console.error(e.message);
      return false
    }
    // this.connectedUser$ = profile.take(1);
  }

  /**
   * Return the AuthState
   */
  getAuthUser() {
    return this.afAuth.authState;
  }


  /**
   * Save the profile in DB
   * @param user : the auth user
   * @param profile : UserProfile
   * @returns true if changes are persisted in db
   */
  async saveProfile(userID: string, profile : UserProfile) {
    //let uid = await this.getAuthUser().
    let profileToSave = this.db.object(`/profiles/${userID}`);
    try {
      await profileToSave.set(profile);
      return true
    } catch(e) {
      console.error(e.message);
      return false
    }
  }

  /**
   * Authentify the MOCK USER | DEPRECATED 
   * @param name for now, I just pass the name, will have leter to authentificate on FireBase
   * @returns true if success
   */
  // connectUser(name:string) : boolean {
  //   if(MOCK_USERS_LIST.filter( user => user.name === name)[0]){
  //     Observable.of(MOCK_USERS_LIST.filter( user => user.name === name)[0]).subscribe(user =>
  //       this.connectedUser = user);
  //     console.log(this.connectedUser$);
  //     return true;
  //   } else {
  //     console.error('No User found...')
  //     return false;
  //   }
  // }

  /**
   * Disconnect the user
   * @returns true if success
   */

   disconnect() : boolean {
     this.connectedUser$ = null;
     this.profile = null;
     if (!this.connectedUser$) {
       return true;
     }
   }

  /**
   * @returns the connected user
   */
  getConnectedUser() : UserProfile {
    return this.profile;
  }


  /**
   * @returns true if there is a user connected
   */
  isConnected() : boolean {
    console.warn(typeof(this.connectedUser));
    if(this.connectedUser && this.connectedUser.isConnected ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Add a structure to the connected user
   * @param structure_key Structure_key to add
   * @param isDefault make the new structure the default structure if true - false by default
   */
  addStructure(structure_key : any, isDefault : boolean = false) : void {
    //Create a structures array if it does not exist
    if (!this.connectedUser.structures) {
      this.connectedUser.structures = [];
    }
    // Add the structure key
    this.connectedUser.structures.push({
      key: structure_key,
    });
    // If isDefault, we have to reconfigure the whole array.
    if (isDefault) {
      this.connectedUser.structures.forEach(element => {
        if (element.key == structure_key) {
          element.isDefault = true;
        } else {
          element.isDefault = false;
        }
      });
    }
    console.debug("Structure added");
  }

  // addStructure(key, isDefault) : void {
  //   this.user.structures.push({
  //     key : key,
  //     isDefault : isDefault,
  //   })
  // }

   // connectMockUser(name:string) : Observable<UserProfile> {
  //   this.user = MOCK_USERS_LIST.filter( user => user.name === name)[0];
  //   return Observable.of(this.user);
  // }

}
