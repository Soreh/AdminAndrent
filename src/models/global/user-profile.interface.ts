export interface UserProfile {
    name ?: string;
    // defaultStructure : any;
    // otherStructures : any[];
    structures ?: {
        key ?: string,
        isDefault ?: boolean,
    }[];
    key ?: string;
    mail ?: string;
    isConnected ?: boolean;
    connectError ?: {
        code ?: string;
        msg ?: string;
    };
}