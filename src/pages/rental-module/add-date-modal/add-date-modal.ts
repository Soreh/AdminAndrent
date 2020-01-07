import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CalendarServiceProvider } from '../../../providers/rentals/calendar/calendar-service';
import { Rental } from '../../../models/rentals/rental.interface';

/**
 * Generated class for the AddDateModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-date-modal',
  templateUrl: 'add-date-modal.html',
})
export class AddDateModalPage {

  public datesList: string[];
  public dateToAdd: string;
  public changeMade: boolean;
  public rental: Rental;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private calendar: CalendarServiceProvider) {
  }

  ionViewWillLoad() {
    this.rental = this.navParams.get('rental');
    this.dateToAdd = new Date().toISOString();
    if (this.navParams.get('datesArray')) {
      this.datesList = this.navParams.get('datesArray');
    } else {
      this.datesList = [];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDateModalPage');
  }

  public outputDate(isoDate: string): string{
    let dateObj = new Date(isoDate);
    return this.calendar.dateToString(dateObj);
  }

  public async addDate() {
    if (this.dateToAdd) {
      this.changeMade = true;
      this.datesList.push(this.dateToAdd);
      await this.calendar.addEventToDate(this.dateToAdd, this.rental);
    }
  }

  public async deleteDate(index) {
    this.changeMade = true;
    let dateToDelete = this.datesList.splice(index, 1);
    await this.calendar.deleteEventsFromDate(dateToDelete, this.rental.id);
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  public closeAndSave() {
    this.viewCtrl.dismiss(
      {
        changeMade: this.changeMade,
        dates: this.datesList,
      }
    )
  }

}
