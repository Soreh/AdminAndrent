import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarServiceProvider } from '../../../providers/rentals/calendar/calendar-service';
import { Subscription } from 'rxjs';

/**
 * Generated class for the RentalCalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rental-calendar',
  templateUrl: 'rental-calendar.html',
})
export class RentalCalendarPage {

  public months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];

  public populatedRows: [DayRow[]];
 
  public daysub: Subscription;
  public daysInDB: DayRow[];

  public today:Date = new Date();
  

  public currentYear: number;
  public currentMonth: number;
  public currentDaysAmount: number;
  public currentFirstDayIndex: number;
  public currentLastDayIndex: number;
  public currentRowsNeeded: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private calendarService: CalendarServiceProvider) {
  }

  ionViewWillLoad() {
    this.loadToday();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalCalendarPage');
  }

  public getMonthName(month: number) {
    return this.months[month];
  }

  private setCurrentMonth(date: Date) {
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    this.currentDaysAmount = this.getDaysAmount(this.currentYear, this.currentMonth);
    this.currentFirstDayIndex = this.getFirstDayOfTheMonthIndex(this.currentYear, this.currentMonth);
    this.currentLastDayIndex = this.getLastDayOfTheMonthIndex(this.currentYear, this.currentMonth);
    this.currentRowsNeeded = this.getRowsNeeded(this.currentYear, this.currentMonth);
    this.getDaysFromDB();
  }

  public addRental(day: DayRow) {
    if (!day.events || day.events.length <= 0) {
      alert('add rental');
    } else {
      alert ('rental list for tha day');
    }
  }

  public showRentalResume(eventId) {
    alert('rentalResume of id : ' + eventId )
  }

  public loadToday() {
    this.today = new Date();
    this.setCurrentMonth(this.today);
  }

  public loadNext() {
    let nextMonth = this.getNextMonth();
    this.setCurrentMonth(new Date(nextMonth.year, nextMonth.month));
  }

  public loadPrevious() {
    let previousMonth = this.getPreviousMonth();
    this.setCurrentMonth(new Date(previousMonth.year, previousMonth.month));
  }

  public changeMonth(day: DayRow) {
    if ( day.before ) {
      this.loadPrevious();
    } else if ( day.after ) {
      this.loadNext();
    }
  }

  public allowBackToToday() {
    return (this.today.getMonth() === this.currentMonth && this.today.getFullYear() === this.currentYear ) ? false : true;
  }

  public getEventsAmount(day: DayRow) {
    return day.events ? day.events.length : 0 ;
  }

  public markDaysAsFree(free: boolean) {
    let selectedDays: DayRow[] = [];
    this.populatedRows.forEach(
      (row) => {
        row.forEach(
          (day) => {
            if (day.selected) {
              day.selected = false;
              day.freeDay = free;
              selectedDays.push(day);
            }
          }
        )
      }
    );
    console.log(selectedDays);
    // save in DB
    selectedDays.forEach(
      (day) => {
        this.calendarService.addDate(day, this.currentYear, this.currentMonth + 1).then(
          () => console.log('Ok !'),
          () => console.error('Oops, something went wrong...')
        );
      }
    )
  }

  private getDaysFromDB() {
    if (this.daysub) {
      this.daysub.unsubscribe();
    }
    this.daysub = this.calendarService.getDatesForCurrentMonth(this.currentYear, this.currentMonth + 1).subscribe(
      (days) => {
        this.daysInDB = days;
        this.populateRows();
      }
    )
  }

  private getPreviousMonth(): {month: number, year: number} {
    let previousMonthIndex = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    let previousYear = previousMonthIndex === 11 ? this.currentYear - 1 : this.currentYear;
    return {
      month: previousMonthIndex,
      year: previousYear
    }
  }

  private getNextMonth(): {month: number, year: number} {
    let nexMonthIndex = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
    let nextYear = nexMonthIndex === 0 ? this.currentYear + 1 : this.currentYear;
    return {
      month: nexMonthIndex,
      year: nextYear
    }
  }

  private getDaysAmount(year: number, month: number) {
    return new Date(year, month +1, -1).getDate()+1;
  }

  private getFirstDayOfTheMonthIndex(year: number, month: number) {
    let index = new Date(year, month, 1).getDay();
    index = (index === 0) ? 7 : index;
    return index;
  }

  private getLastDayOfTheMonthIndex(year: number, month: number) {
    let index = new Date(year, month, this.getDaysAmount
      (year, month)).getDay();
    index = (index === 0) ? 7 : index ;
    return index;
  }

  private getRowsNeeded(year: number, month: number) {
    let offsetDays = (this.getFirstDayOfTheMonthIndex(year, month)) - 1;
    let days = (this.getDaysAmount(year, month)) + offsetDays;
    let rows = ((days - (days%7)) / 7) + 1;
    return rows ;
  }

  private populateRows() {
    this.populatedRows = [[]];
    let previousMonth = this.getPreviousMonth();
    let previousDayDate = this.getDaysAmount(previousMonth.year, previousMonth.month) - this.currentFirstDayIndex + 2 ;
    let nextDayDate = 1 ;
    for (let rowIndex = 0; rowIndex < this.currentRowsNeeded; rowIndex++) {
      let dayRow: DayRow[] = [];
      for ( let dayIndex = 1; dayIndex <= 7; dayIndex++) {
        // If it is the first row
        if (rowIndex === 0) {
          if (dayIndex < this.currentFirstDayIndex) {
            dayRow.push({
              date: previousDayDate,
              offset: true,
              before: true,
              freeDay: false,
            })
            ++previousDayDate;
          } else {
            let date = dayIndex - this.currentFirstDayIndex + 1;
            let dayInDb = this.checkCurrentDay(date);
            if (dayInDb) {
              dayRow.push(dayInDb);
            } else {
              dayRow.push({
                date: date,
                offset: false,
                freeDay: false,
              })
            }
          }
        }
        // for the remaining rows
        else {
          // the last one
          if (dayIndex > this.currentLastDayIndex && rowIndex === this.currentRowsNeeded - 1) {
            dayRow.push({
              date: nextDayDate,
              offset: true,
              after: true,
              freeDay: true,
            })
            ++nextDayDate;
          } 
          // the others
          else {
            let date = ((rowIndex * 7) + 1) - (this.currentFirstDayIndex - 1) + (dayIndex - 1);
            let dayInDb = this.checkCurrentDay(date);
            if (dayInDb) {
              dayRow.push(dayInDb);
            } else {
              dayRow.push({
                date: date,
                offset: false,
                freeDay: false,
              })
            }
          }
        }
      }
      this.populatedRows.push(dayRow);
    }
  }

  private checkCurrentDay(date: number): false | DayRow {
    let dayIndex = this.daysInDB.findIndex((day) => day.date === date);
    return (dayIndex === -1) ? false : this.daysInDB[dayIndex];
  }
}

export interface DayRow {
  date: any;
  events?: DayRentalInfos[];
  offset?: boolean;
  before?: boolean;
  after?: boolean;
  freeDay: boolean;
  selected?: boolean;
}

export interface DayRentalInfos {
  eventId: any;
  eventName: string;
  eventStatusCode: number;
}