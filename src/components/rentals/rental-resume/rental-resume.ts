import { Component, Input, OnInit } from '@angular/core';
import { STATUS, STATUSCODE } from '../../../models/global/status.interface';
import { Contact } from '../../../models/global/contact.interface';
import { Rental } from '../../../models/rentals/rental.interface';
import { NavController} from 'ionic-angular';

/**
 * Generated class for the RentalResumeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rental-resume',
  templateUrl: 'rental-resume.html'
})
export class RentalResumeComponent implements OnInit{

  @Input() rental : Rental;
  // name : string;
  // status : number;
  // payment_status : number;
  // location_name : string;
  // dates : string;
  // contact : Contact;
  // color_class : any;

  constructor(private navCtrl:NavController) {
    console.log('Hello RentalResumeComponent Component');
  }
  
  ngOnInit(){
    // this.name = this.rental.name;
    // this.status = this.rental.status;
    // this.payment_status = this.rental.payment_status;
    // this.location_name = this.rental.location.label;
    // this.dates = this.rental.date_label;
    // this.contact = this.rental.contact.find( contact => contact.main );
  }

  getFirstContact() : Contact {
    return this.rental.contact.find( contact => contact.main );
  }

  getStatusLabel(statusCode) : string {
    return STATUS.getLabel(statusCode);
  }

  getColorClass(statusCode) : string {
    return STATUS.getColor(statusCode);
  }

  
}
