import { OptionCategory, QuotationOption, ChargeType, Charge } from "./quotation-option.interface";
import { Location } from "./location.interface";
import { Moduleconfig } from "../global/module-config.interface";
import { ContractScheme } from "../global/contract-scheme.interface";


export interface RentalConfig extends Moduleconfig {
    key ?: string;
    name ?: string;
    categories : OptionCategory[];
    options : QuotationOption[];
    locations : Location[];
    chargesTypes : ChargeType[];
    chargesTypeDetails : Charge[];
    contractConditions?: ContractCondition[];
    rentalContractScheme?: ContractScheme; 
}

export interface ContractCondition {
    id: any;
    label: string;
    desc?: string;
    type?:any;
    isList?: boolean;
}
