// Classes needed 
import { Injectable } from '@angular/core';

// Interfaces
import { RentalConfig } from "../../../models/rentals/rentals-config.interface";
import { DayRow, DayRentalInfos } from "../../../pages/rental-module/rental-calendar/rental-calendar";

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
import { Rental } from '../../../models/rentals/rental.interface';


/*
  The service to handle the rental calendar data in DB
*/
@Injectable()
export class CalendarServiceProvider {

  module_key = MODULES_KEYS.rental;
  config: RentalConfig;

  public daysList: AngularFirestoreCollection<DayRow>;
  public eventsList: AngularFirestoreCollection<DayRentalInfos>;
  public day: AngularFirestoreDocument<DayRow>;


  constructor(
    private struct : StructureServiceProvider,
    private afAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore ) {

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

  /***********
   * UTILITIES
   */

  

  public dateToString(date: Date) {
    let day = date.getDate();
    let zeroDay = day < 10 ? '0' : '';
    let month = date.getMonth() + 1;
    let zeroMonth = month < 10 ? '0' : '';
    let year = date.getFullYear();
    return `${zeroDay}${day}/${zeroMonth}${month}/${year}`;
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
    return this.daysList.doc(`${day.date}`).set({
      date: day.date,
      freeDay: day.freeDay
    }).then(
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

  /**
   * Returns on observable of the events stored in DB for a given day
   * @param year number
   * @param month number
   */
  public getEventsForDay(year: number, month: number, dayDate: number) {
    this._setDay(dayDate, year, month);
    this.eventsList = this.day.collection('events');
    return this.eventsList.valueChanges();
  }

  /********
   * UPDATE 
   */

  public async addEventFromRental(rental: Rental, rentalId: any) {
    if (rental.calendar_dates) {
      rental.calendar_dates.forEach(
        async (date) => {
          let newDate = new Date(date);
          let dayDate = newDate.getDate();
          let year = newDate.getFullYear();
          let month = newDate.getMonth() + 1;
          this._setDay(dayDate, year, month);
          let event: DayRentalInfos = {
            eventId: rentalId,
            eventName: rental.name,
            eventStatusCode: rental.status
          };
          this.day.update({date: dayDate}).then(
            () => console.debug('Day updated - ok'),
            () => this.day.set({
              date: dayDate,
              freeDay: false,
            })
          );
          await this.day.collection('events').doc(rentalId).set(event);
        });
    }
  }

  public async addEventToDate(isoDate: string, rental: Rental) {
    this._setDayFromIso(isoDate);
    let date = new Date(isoDate).getDate();
    this.day.update({date: date}).then(
      () => console.debug('ok, date exists'),
      () => this.day.set({
        date: date,
        freeDay: false,
      })
    );
    await this.day.collection('events').doc(rental.id).set({
      eventId: rental.id,
      eventName: rental.name,
      eventStatusCode: rental.status,
    })
  }

  public async updateEventStatus(rental: Rental) {
    if (rental.calendar_dates) {
      rental.calendar_dates.forEach(
        async (date) => {
          this._setDayFromIso(date);
          await this.day.collection('events').doc(rental.id).update({
            eventStatusCode: rental.status
          })
        }
      )
    }
  }

  /********
   * DELETE
   */

  public async deleteEventsFromRental(rental: Rental) {
    if (rental.calendar_dates) {
      rental.calendar_dates.forEach(
        async (date) => {
          this._setDayFromIso(date);
          await this.day.collection('events').doc(rental.id).delete();
        }
      )
    }
  }

  public async deleteEventsFromDate(isoDate, rentalId) {
    this._setDayFromIso(isoDate);
    await this.day.collection('events').doc(rentalId).delete();
  }

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

  /**
   * Set the path to DB day (db: calendar/year/month/day)
   * @param year number
   * @param month number
   */
  private _setDay(dayDate: number, year: number, month: number): void {
    const dayStr = dayDate.toString();
    const yearStr = year.toString();
    const monthStr = month.toString();
    this.day = this.angularFirestore.doc(`calendar/${yearStr}/${monthStr}/${dayStr}`);
  }

  private _setDayFromIso(isoDate: string): void {
    let newDate = new Date(isoDate);
          let dayDate = newDate.getDate();
          let year = newDate.getFullYear();
          let month = newDate.getMonth() + 1;
          this._setDay(dayDate, year, month);
  }

}
