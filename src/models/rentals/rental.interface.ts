import { Quotation } from "./quotation.class";
import { Log } from "./log.interface";
import { Location } from "./location.interface";
import { Contact } from "../global/contact.interface";

export interface Rental {
    struct_key  : string;
    id          : any;
    name        : string;
    status      : number; //Has to be later a collection Status
    payment_status : number;
    location    : Location; //Has to be later a Salle
    contact     : Contact[]; //Has to be later a Client[]
    log         : Log[];
    client      ?: any; //Has to be later a Client
    tech        ?: string,
    quotation_args ?: any;
    quotation   ?: Quotation;
    dates       ?: any; //Will have to be a Date or Timestamp
    date_label  ?: string;
    schedule    ?: string;
    notes       ?: string;
    contract    ?: any; //Will have to be an Object including a rentalContract and its statuses
    advance_invoice ?: any; //Will have to be an Object including an Invoic and its statuses
    invoice     ?: any; //Will have to be later an Object including Invoice and and its statuses
}