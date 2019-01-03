import { Client } from "./client.interface";
import { ArgumentOutOfRangeError } from "rxjs";
import { ValueTransformer } from "@angular/compiler/src/util";
import { Status } from "../global/status.interface";
import { Label } from "ionic-angular";
import { dateDataSortValue } from "ionic-angular/umd/util/datetime-util";

export interface Invoice {
    id?: string,
    client?: Client,
    amount?: number,
    status?: any,
    label?: string,
    date?: string,
}