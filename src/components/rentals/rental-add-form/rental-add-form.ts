import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup  } from "@angular/forms";
import { Rental } from '../../../models/rentals/rental.interface';
import { Contact } from '../../../models/global/contact.interface';
import { STATUSCODE } from "../../../models/global/status.interface";
import { Log } from '../../../models/rentals/log.interface';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { ViewController, NavController } from 'ionic-angular';
import { CalendarServiceProvider } from '../../../providers/rentals/calendar/calendar-service';

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
  @Input() firstDate;
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
    private calendar: CalendarServiceProvider) {
    console.log('Hello RentalAddFormComponent Component');
    this.rentalToAdd = this.formBuilder.group({
      name : ['', Validators.required],
      location : ['', Validators.required],
      contact_name : ['', Validators.required],
      contact_tel :[''],
      contact_mail : [''],
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
      contact : [mainContact],
      location_id : this.rentalToAdd.value.location,
    }

    if (this.firstDate) {
      rental.calendar_dates = [];
      rental.calendar_dates.push(this.firstDate);
      let stringDate = this.calendar.dateToString(new Date(this.firstDate));
      rental.dates = stringDate;
    }

    console.debug(`location à ajouter : ${rental}`);

    this.rentalService.addRental(rental)
      .then(
        (id) => {
          if (id) {
            this.calendar.addEventFromRental(rental, id);
            this.viewCtrl.dismiss(id);
          }
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
      tel : this.rentalToAdd.value.contact_tel,
      mail : this.rentalToAdd.value.contact_mail,
      main : true,
    }
    console.debug(contact);
    return contact;
  }
}
