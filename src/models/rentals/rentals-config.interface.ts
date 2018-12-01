import { OptionCategory, QuotationOption, ChargeType, Charge } from "./quotation-option.interface";
import { Location } from "./location.interface";


export interface RentalConfig {
    key ?: string;
    name ?: string;
    categories : OptionCategory[];
    options : QuotationOption[];
    locations : Location[];
    chargesTypes : ChargeType[];
    chargesTypeDetails : Charge[];
    
}
