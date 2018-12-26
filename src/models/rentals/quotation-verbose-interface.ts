export interface Quotationverbose {
    amount : number;
    discount ?: number;
    categories : QuotationverboseCategory[];
}

export interface QuotationverboseLine {
    label : string;
    amount : number;
}

export interface QuotationverboseCategory {
    id: string;
    label : string;
    lines : QuotationverboseLine[];
}