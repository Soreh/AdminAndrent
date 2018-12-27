import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Quotation, QuotationArgs } from '../../../models/rentals/quotation.class';

/**
 * Generated class for the QuotationModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quotation-modal',
  templateUrl: 'quotation-modal.html',
})
export class QuotationModalPage {

  public quotation_args: QuotationArgs;
  public destination: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.quotation_args = this.navParams.get('quotationArgs');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationModalPage');
  }
  

  
  goToDash(){
    this.destination = "dash";
    this.viewCtrl.dismiss(this.destination);
  }
  
  seeVerbose(){
    this.destination = "see";
    this.viewCtrl.dismiss(this.destination);
  }
}
