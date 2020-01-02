// Classes needed 
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

// Interfaces
import { RentalConfig } from "../../../models/rentals/rentals-config.interface";
import { DayRow } from "../../../pages/rental-module/rental-calendar/rental-calendar";

// Services needed
import { StructureServiceProvider } from '../../global/structure-service/structure-service';

// Constants
import { MODULES_KEYS } from '../../global/modules/modules';

// Angularfire2
import{
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth'


/*
  The service to handle the rental calendar data in DB
*/
@Injectable()
export class CalendarServiceProvider {

  module_key = MODULES_KEYS.rental;
  config: RentalConfig;

  public daysList: AngularFirestoreCollection<DayRow>;


  constructor(
    private struct : StructureServiceProvider,
    private afAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore ) {
    console.log('Hello RentalServiceProvider Provider');

  }
  
  // CONFIG

  /**
   * Set the Config Option for the loaded structure
   */
  private async _setConfig(): Promise<void> {
    await this.struct.getStructureModuleConfigBykey(this.module_key).then( 
      (config) => {
        if (config) {
          this.config = <RentalConfig>config;
        }
      }
    );
  }
  
  /**
   * Get the Rental config for the loaded structure
   * @returns RentalConfig
   */
  public getConfig() : RentalConfig {
    return this.config;
  }

  public async loadConfig() {
    this.afAuth.authState.subscribe( (user) => {
      if (user) {
        this._setConfig().then(() => {
          if (this.config) {
            console.debug(`config chargée : ${this.config}`);
            // this.rentalsPath = firebase.firestore().collection(`/rentals/`);
          }
        });
      }
    })
  }

  public isConfigLoaded() : boolean {
    return (this.config)?true:false;
  }


  /********
   * CREATE
   */

  /**
   * Set a day in DB (database:/calendar/year/month)- destructive
   * @param day the DayRow to persist 
   * @param year number
   * @param month
   * @returns a promise, true if ok, false otherwise
   */
  public async addDate(day: DayRow, year: number, month: number) {
    this._setDaysList(year, month);
    return this.daysList.doc(`${day.date}`).set(day).then(
        () => {
            return true
        },
        (e) => {
            console.error(e);
            return false},
    );
  }

  /******
   * READ
   */

  /**
   * Returns on observable of the days stored in DB for a given month
   * @param year number
   * @param month number
   */
  public getDatesForCurrentMonth(year: number, month: number) {
    this._setDaysList(year, month);
    return this.daysList.valueChanges();
  }

  /********
   * UPDATE 
   */

  /********
   * DELETE
   */

  /*******************
   * PRIVATE FUNCTIONS
   */

  /**
   * Set the path to DB (db: calendar/year/month)
   * @param year number
   * @param month number
   */
  private _setDaysList(year: number, month: number): void {
    const yearStr = year.toString();
    const monthStr = month.toString();
    this.daysList = this.angularFirestore.collection(`calendar/${yearStr}/${monthStr}`); 
  }

}
