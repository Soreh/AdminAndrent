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
import { ViewController } from 'ionic-angular';
import { ValueTransformer } from '@angular/compiler/src/util';

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
  config$: RentalConfig;

  constructor(private user : UserServiceProvider, private rentalService: RentalServiceProvider, private viewCtrl : ViewController, private formBuilder: FormBuilder) {
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
  }

  ngOnInit() {
    this.errorIdMsg = "Oops... Pas de structure chargée...";
    this.config$ = this.rentalService.getConfig();
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

  add() : void {
    let firstLog: Log = {
      author : this.user.getConnectedUser().name + ' (auto)',
      date : new Date(),
      msg : 'Création'
    };
    console.warn("Il faut ajouter :");
    let contact : Contact = {
      name : this.rentalToAdd.value.contact_name,
      surname : this.rentalToAdd.value.contact_surname,
      tel : this.rentalToAdd.value.contact_tel,
      mail : this.rentalToAdd.value.contact_mail,
      main : true,
    }
    let rental : Rental = {
      name : this.rentalToAdd.value.name,
      struct_key : this.id,
      status : STATUSCODE.firstContact,
      payment_status : STATUSCODE.toBePaid,
      log : [firstLog],
      dates : this.rentalToAdd.value.dates,
      contact : [contact],
      location : this.rentalToAdd.value.location,
    }
    console.warn(rental);
    // this.rentalToAdd.log.push(firstLog);
    // this.rentalToAdd.contact.push(this.contactToAdd);
    // console.warn(this.rentalToAdd);
    this.rentalService.addRental(rental);
    this.viewCtrl.dismiss();
  }
}
