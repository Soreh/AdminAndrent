import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DayRentalInfos } from '../rental-calendar/rental-calendar';

/**
 * Generated class for the SeeEventsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-see-events-modal',
  templateUrl: 'see-events-modal.html',
})
export class SeeEventsModalPage {


  public eventsList: DayRentalInfos[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewWillLoad() {
    this.eventsList = this.navParams.get('events');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SeeEventsModalPage');
  }

  addRental() {
    this.viewCtrl.dismiss({
      add: true
    })
  }

  goToRental(id) {
    this.viewCtrl.dismiss({
      rentalId: id
    })
  }

}
