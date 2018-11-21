import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the NewRentalModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-rental-modal',
  templateUrl: 'new-rental-modal.html',
})
export class NewRentalModalPage {

  id: any;

  constructor(public viewCtrl : ViewController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.id = this.navParams.get('id');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewRentalModalPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
