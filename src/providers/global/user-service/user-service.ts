import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../models/global/user.interface';
import { Observable } from 'rxjs/Observable';

import { MOCK_USERS_LIST } from "../../../mock_data/global/users_mock";

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  user: User;

  constructor() {

  }

  connectMockUser(name:string) : Observable<User> {
    this.user = MOCK_USERS_LIST.filter( user => user.name === name)[0];
    return Observable.of(this.user);
  }

  getConnectedUser(){
    return this.user;
  }

  // addStructure(key, isDefault) : void {
  //   this.user.structures.push({
  //     key : key,
  //     isDefault : isDefault,
  //   })
  // }

}
