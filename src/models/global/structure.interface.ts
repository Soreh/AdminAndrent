import { Moduleconfig } from "./module-config.interface";
import { isBlank } from "ionic-angular/umd/util/util";
import { createPipe } from "@angular/compiler/src/core";

export interface Structure {
    key ?: string;
    modules ?: {
        module_key : string,
        config : Moduleconfig,
    }[];
    users ?: {
        user_key : string;
        isAdmin : boolean;
    }[],
    name : string,
    contact : {
        street : string,
        number : number,
        cp?: number,
        city : string,
        tel ?: string,
        mail ?: string,
    },
    vat?: string,
    enterpriseNumber?: string,
    bankAccount?: [
        {
            label?: string,
            bic?: string,
            iban?: string,
            main?: boolean
        }
    ]
}

export interface Struct_Meta {
    isDefault ?: boolean,
    key : string,
    name : string;
}