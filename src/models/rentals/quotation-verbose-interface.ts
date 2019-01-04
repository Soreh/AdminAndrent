import { Client } from "../invoices/client.interface";

export interface Quotationverbose {
    amount : number;
    discount ?: number;
    categories : QuotationverboseCategory[];
    date?: string,
    postQuotation?: [
        {
            id?: any,
            label?: string,
            price?: number,
            normal_price?: number,
        }
    ],
    client?: Client,
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