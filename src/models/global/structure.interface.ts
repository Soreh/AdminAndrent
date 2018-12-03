import { Moduleconfig } from "./module-config.interface";

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
        city : string,
        tel ?: string,
        mail ?: string,
    },
}

export interface Struct_Meta {
    isDefault ?: boolean,
    key : string,
    name : string;
}