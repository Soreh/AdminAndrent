import { RentalServiceProvider } from "../providers/rentals/rental-service/rental-service";
import { UserServiceProvider } from "../providers/global/user-service/user-service";
import { Rental } from "../models/rentals/rental.interface";
import { Log } from "../models/rentals/log.interface";
import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";

@Injectable()
export class LogController {

    private _author : string;
    //private _rental : Rental;
    private _msg    : string;
    private _log    : Log;
    private _date    : Date;
  
    constructor(private user: UserServiceProvider) {
    }

    /**
     * Create a new Log in the rental of rentalId
     * @param rentalId 
     * @param automatedMsg the automated msg generated (optionnal)
     * @param msg the msg to print (optionnal)
     */
    log(rent: Rental, automatedMsg: string, msg: string) : void {
        this._date = new Date(); // TO DO STYLE IT ! LIKE DD/MM/YY à HH.MM
        console.warn("TO DO : style the date like DD/MM/YY à HH.MM");
        this._author = this.user.getConnectedUser().name;
        if ( msg == '') {
            this._author += ' (auto)';
        } else {
            automatedMsg += '<br>'
        }

        this._msg = msg + automatedMsg;
        this._log = {
            author  : this._author,
            date    : this._date,
            msg     : this._msg,
        }
        rent.log.unshift(this._log);
    }
}