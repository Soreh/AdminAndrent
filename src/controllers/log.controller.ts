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
        console.debug('Hello log controller');
    }

    /**
     * Create a new Log in the rental of rentalId
     * @param rentalId 
     * @param automatedMsg the automated msg generated (optionnal)
     * @param msg the msg to print (optionnal)
     */
    async log(rent: Rental, automatedMsg: string, msg: string) : Promise<void> {
        this._date = new Date();
        if (automatedMsg != '' || msg != '') {

            await this.user.getUserName().then(
                (name) => {
                    this._author = name;
                    if ( msg == '') {
                        this._author += ' (auto)';
                    } else {
                        if (automatedMsg != '') {
                            automatedMsg += '<br>';
                        }
                    }
            
                    this._msg = automatedMsg + msg;
                    this._log = {
                        author  : this._author,
                        date    : Date.now(),
                        msg     : this._msg,
                    }
                    console.debug(this._log);
                    rent.log.unshift(this._log);
                }
            );
        }
    }
}