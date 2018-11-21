
export interface QuotationOption {
    id : any;
    label : any;
    catId : any;
    amount : number;
    cost : number;
    isCalculated ?: boolean;
    chargeTypeId ?: any;
    chargeId ?: any;
    formula ?: Formula;
    infos ?: string;
    unit ?: number;
}

export interface Formula {
    terms : any[];
    operators : any [];
}

export interface OptionCategory {
    id : any;
    label : string;
    isPostQuotation? : boolean;
}

export interface ChargeType {
    id : any;
    label : string;
    chargesId ?: any[];
}

export interface Charge {
    id : any;
    label : string;
    amount : number;
    cost : number;
    isPartOfFormula ?: boolean;
    chargeTypeId : any;
}

export interface savedOptionByCategory {
    name : any;
    isPost : boolean;
    options : QuotationOption[];
}