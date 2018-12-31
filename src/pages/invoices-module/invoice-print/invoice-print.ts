import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Invoice } from '../../../models/invoices/invoice.interface';

/**
 * Generated class for the InvoicePrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-print',
  templateUrl: 'invoice-print.html',
})
export class InvoicePrintPage implements OnInit {

  public invoice: Invoice;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.invoice = this.navParams.get('invoice');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePrintPage');
  }

  close() {
    this.navCtrl.pop();
  }

  goHome() {
    this.navCtrl.setRoot('StartPage');
  }

}
