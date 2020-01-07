import { Quotation } from "./quotation.class";
import { Log } from "./log.interface";
import { Location } from "./location.interface";
import { Contact } from "../global/contact.interface";
import { QuotationArgs } from "../rentals/quotation.class";

import { Client } from "../invoices/client.interface";
import { Invoice } from "../invoices/invoice.interface";
import { Contract } from "./contract.interface";

export interface Rental {
    struct_key  : string;
    name        : string;
    status      : number; //Has to be later a collection Status
    contact     : Contact[]; //Has to be later a Client[]
    log         : Log[];
    location_id    ?: any; //Has to be later a Salle
    payment_status ?: number;
    id          ?: any;
    client      ?: Client; //Has to be later a Client
    tech        ?: string,
    quotation_args ?: QuotationArgs;
    quotation   ?: Quotation;
    dates       ?: string; 
    date_label  ?: string; // Unused ?
    schedule    ?: string;
    notes       ?: string;
    contract    ?: Contract; //Will have to be an Object including a rentalContract and its statuses
    advance_invoice ?: Invoice; //Will have to be an Object including an Invoic and its statuses
    invoice     ?: Invoice; //Will have to be later an Object including Invoice and and its statuses 
    regu_invoice ?: Invoice;
    calendar_dates ?: string[];
}