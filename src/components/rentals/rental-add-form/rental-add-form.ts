import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup  } from "@angular/forms";
import { Rental } from '../../../models/rentals/rental.interface';
import { Identifiers } from '@angular/compiler';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
import { Contact } from '../../../models/global/contact.interface';
import { STATUSCODE } from "../../../models/global/status.interface";
import { Log } from '../../../models/rentals/log.interface';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { ViewController, NavController } from 'ionic-angular';
import { ValueTransformer } from '@angular/compiler/src/util';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

/**
 * Generated class for the RentalAddFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rental-add-form',
  templateUrl: 'rental-add-form.html'
})
export class RentalAddFormComponent implements OnInit {

  @Input() id;
  rentalToAdd: FormGroup;
  contactToAdd: Contact;
  errorIdMsg: string;
  errorMsg: string;
  config: RentalConfig;

  constructor(
    private user : UserServiceProvider, 
    private rentalService: RentalServiceProvider, 
    private viewCtrl : ViewController, 
    private formBuilder: FormBuilder,
    private navCtrl: NavController) {
    console.log('Hello RentalAddFormComponent Component');
    this.rentalToAdd = this.formBuilder.group({
      name : ['', Validators.required],
      location : ['', Validators.required],
      dates : [''],
      contact_name : ['', Validators.required],
      contact_surname : ['', Validators.required],
      contact_tel :[''],
      contact_mail : ['', Validators.email],
    })
    this.config = this.rentalService.getConfig();
  }

  ngOnInit() {

    // let firstLog: Log = {
    //   author : this.user.getConnectedUser().name + ' (auto)',
    //   date : new Date(),
    //   msg : 'Création'
    // }
    // this.contactToAdd = {
    //   name :'',
    //   surname : '',
    //   tel : '',
    //   mail : '',
    //   main : true,
    // }
    // this.rentalToAdd = {
    //   name : '',
    //   struct_key : this.id,
    //   status : STATUSCODE.firstContact,
    //   payment_status : STATUSCODE.toBePaid,
    //   log : [firstLog],
    //   contact : [this.contactToAdd],
    // }
  }

  async addNewRental() {

    console.debug(this.rentalToAdd);

    const firstLog = await this._geFirstLog();
    const mainContact = this._getContact();

    let rental : Rental = {
      name : this.rentalToAdd.value.name,
      struct_key : this.id,
      status : STATUSCODE.firstContact,
      payment_status : STATUSCODE.toBePaid,
      log : [firstLog],
      dates : this.rentalToAdd.value.dates,
      contact : [mainContact],
      location_id : this.rentalToAdd.value.location,
    }

    console.debug(`location à ajouter : ${rental}`);

    this.rentalService.addRental(rental)
      .then(
        () => {
          this.viewCtrl.dismiss();
        },
        (e) => {
          console.warn("Impossible d'ajouter la location : " + e);
        }
      )

  }


  private async _geFirstLog(): Promise<Log> {
    return await this.user.getUserName()
      .then(
        (name) => {
          let firstLog: Log = {
            author: name + ' (auto)',
            date: Date.now(),
            msg: 'Création'
          };
          console.debug(firstLog);
          return firstLog;
        }
      )

    // let firstLog: Log = {
    //   author : await this.user.getUserName() + ' (auto)',
    //   date : new Date(),
    //   msg : 'Création'
    // };
    // console.debug(firstLog);
    // return firstLog;
  }

  private _getContact(): Contact {
    const contact = {
      name : this.rentalToAdd.value.contact_name,
      surname : this.rentalToAdd.value.contact_surname,
      tel : this.rentalToAdd.value.contact_tel,
      mail : this.rentalToAdd.value.contact_mail,
      main : true,
    }
    console.debug(contact);
    return contact;
  }
}
