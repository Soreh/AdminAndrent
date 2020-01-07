import { Client } from "./client.interface";

export interface Invoice {
    id?: string,
    client?: Client,
    amount?: number,
    status?: any,
    label?: string,
    date?: string,
    lines?: InvoiceLine[],
    quotationTotal?: number,
    reg?: boolean,
    parentInvoice?: any
}

export interface InvoiceLine {
    label: string,
    amount: number
}