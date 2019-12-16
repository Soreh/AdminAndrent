import { Client } from "../invoices/client.interface";

export interface Contract {
    id ?: string,
    status_code ?: any,
    type?: any,
    // The following are deprecated :
    options ?: ContractOption[],
    specialClause ?: string,
    hasTech?: boolean;
    hasPromo?: boolean;
    isOpenToPublic?: boolean;
    hasReceptionStaff?: boolean;
    hasTicketing?: boolean;
    hasTicketingStaff?: boolean;
    hasBar?: boolean;
    techList?: string[];
}

export interface ContractOption {
    conditionId: string;
    label: string;
    isBool: boolean;
    value: boolean;
    list?: string[];
    desc?: string;
}

export interface ContractPrint {
    client: Client;
    articles: ContractPrintArticle[];
}

export interface ContractPrintArticle {
    paragraphs: ContractPrintPara[];
    title: string;
}

export interface ContractPrintPara {
    text: string;
    alineas? : ContractPrintPara[];
    list?: string[]
}