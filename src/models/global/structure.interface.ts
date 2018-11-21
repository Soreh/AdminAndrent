export interface Structure {
    key ?: string;
    modules ?: {
        module_key : string,
        config_key : string,
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