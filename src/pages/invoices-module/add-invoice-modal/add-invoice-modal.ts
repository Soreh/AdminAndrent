import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Invoice } from '../../../models/invoices/invoice.interface';
import { STATUSCODE, STATUS } from '../../../models/global/status.interface';

/**
 * Generated class for the AddInvoiceModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-invoice-modal',
  templateUrl: 'add-invoice-modal.html',
})
export class AddInvoiceModalPage implements OnInit{

  public invoice: Invoice;
  public statuses = [
    {
      code: STATUSCODE.toDO,
      label: STATUS.getLabel(STATUSCODE.toDO),
    },
    {
      code: STATUSCODE.send,
      label: STATUS.getLabel(STATUSCODE.send),
    },
    {
      code: STATUSCODE.paid,
      label: STATUS.getLabel(STATUSCODE.paid),
    },
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ngOnInit(){
    this.invoice = this.navParams.get("invoice");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInvoiceModalPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  submit() {
    this.viewCtrl.dismiss({
      change: true,
    })
  }

  viewInvoice() {
    this.viewCtrl.dismiss({view: true});
    console.warn('Allez sur la page de print de la facture'); 
  }

}
