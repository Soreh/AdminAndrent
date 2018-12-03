import { OptionCategory, QuotationOption, ChargeType, Charge } from "./quotation-option.interface";
import { Location } from "./location.interface";
import { Moduleconfig } from "../global/module-config.interface";


export interface RentalConfig extends Moduleconfig {
    key ?: string;
    name ?: string;
    categories : OptionCategory[];
    options : QuotationOption[];
    locations : Location[];
    chargesTypes : ChargeType[];
    chargesTypeDetails : Charge[];
    
}
