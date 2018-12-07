//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { StructureServiceProvider } from '../global/structure-service/structure-service';
//import { UserCredential } from 'firebase/auth';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor( private structService : StructureServiceProvider) {
    console.log('Hello AuthServiceProvider Provider');
  }

  /**
   * @param email: string
   * @param password: string
   * @returns Promise<User>
   */
  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logOut(): Promise<void> {
    this.structService.destroyCurrentStructureID();
    return firebase.auth().signOut();
  }

  isConnected(): Promise<boolean>{
    return new Promise((resolve, reject) => { 
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
        } else {
          console.debug('User is not logged in');
          resolve(false)
        }
      });
    })
  }

}
