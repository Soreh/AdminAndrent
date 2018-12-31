import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contract } from '../../../models/rentals/contract.interface';

/**
 * Generated class for the ContractPrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contract-print',
  templateUrl: 'contract-print.html',
})
export class ContractPrintPage {

  public contract: Contract;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.contract = this.navParams.get('contract');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractPrintPage');
  }

  close() {
    this.navCtrl.pop();
  }

  goHome() {
    this.navCtrl.setRoot('StartPage');
  }

}
