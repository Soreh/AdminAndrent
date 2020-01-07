import { Component, Input, OnInit } from '@angular/core';
import { STATUS, STATUSCODE } from '../../../models/global/status.interface';
import { Contact } from '../../../models/global/contact.interface';
import { Rental } from '../../../models/rentals/rental.interface';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';

/**
 * Generated class for the RentalResumeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 * 
 * ATTENTION POSSIBILITE DE MEMORY LEAK ? A CREUSER....
 */
@Component({
  selector: 'rental-resume',
  templateUrl: 'rental-resume.html'
})
export class RentalResumeComponent implements OnInit {

  @Input() rental:Rental;


  public color_class: any;
  public status_label: any;
  public contact: Contact;
  public locationName: string;

  public needPayment: boolean;
  public needQuotation: boolean;
  public needInvoice: boolean;
  public quotationInProgress: boolean;
  public paymentDone: boolean;
  

  constructor(
    private rentalsProvider: RentalServiceProvider) {
  }

  ngOnInit(){
    this.contact = this.rental.contact.find( contact => contact.main );
    if (this.rental.status === STATUSCODE.confirmed || this.rental.status === STATUSCODE.option || this.rental.status === STATUSCODE.over) {
      if (!this.rental.quotation_args) {
        this.needQuotation = true;
      }
      if (this.rental.quotation_args) {
        if (this.rental.quotation_args.statusCode === STATUSCODE.toDO || this.rental.quotation_args.statusCode === STATUSCODE.toBeSend) {
          this.needQuotation = true;
        } else {
          if (this.rental.invoice) {
            if (this.rental.invoice.status != STATUSCODE.paid) {
              this.needPayment = true;
            } else {
              this.paymentDone = true;
            }
          } else {
            if (this.rental.quotation_args.statusCode === STATUSCODE.approved) {
              this.needInvoice = true;
            } else {
              this.quotationInProgress = true;
            }
          }
        }
      }
    }
    
    // this.color_class = STATUS.getLabel(this.rental.status);
    // this.status_label = STATUS.getLabel(this.rental.status); 
    // this.contact = this.rental.contact.find( contact => contact.main );
    // this.name = this.rental.name;
    // this.status = this.rental.status;
    // this.payment_status = this.rental.payment_status;
    // this.location_name = this.rental.location.label;
    // this.dates = this.rental.date_label;
    // this.contact = this.rental.contact.find( contact => contact.main );
  }

  // getFirstContact() : Contact {
  //   return this.rental.contact.find( contact => contact.main );
  // }

  getStatusLabel(statusCode): string {
    //console.debug("in get statusLabel...");
    return STATUS.getLabel(statusCode);
  }

  getColorClass(statusCode): string {
    //console.debug("in get colorClass...");
    return STATUS.getColor(statusCode);
  }

  getLocationLabel(location_id): string {
    return this.rentalsProvider.getLocationLabel(location_id);
  }

  getContact(): Contact {
    return this.rental.contact.find( contact => contact.main);
  }

  
}
