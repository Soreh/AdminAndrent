import { QuotationOption } from "./quotation-option.interface";

export interface CategoryDetail {
    catName ?: string;
    pricesList ?: Array<QuotationOption>;
    id ?: any;
}