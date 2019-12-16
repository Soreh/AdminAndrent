export interface RentalContract {
    id?: any;
    statusCode?: any;
    type?:any;
    hasTech?: boolean;
    hasPromo?: boolean;
    isOpenToPublic?: boolean;
    hasReceptionStaff?: boolean;
    hasTicketing?: boolean;
    hasTicketingStaff?: boolean;
    hasBar?: boolean;
    techList?: [string];
    art11?: string;
}