export interface User {
    name : string;
    // defaultStructure : any;
    // otherStructures : any[];
    structures ?: {
        key : string,
        isDefault ?: boolean,
    }[];
    key ?: string;
    email ?: string;
}