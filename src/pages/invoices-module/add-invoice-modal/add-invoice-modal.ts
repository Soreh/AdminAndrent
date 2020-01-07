import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Invoice, InvoiceLine } from '../../../models/invoices/invoice.interface';
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
  ];

  public line: InvoiceLine = {
    label: '',
    amount: 0
  }
  public warning:boolean;
  public change: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ngOnInit(){
    this.invoice = this.navParams.get("invoice");
  }

  ionViewDidLoad() {
  }

  setChange() {
    this.change = true;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  submit() {
    this.viewCtrl.dismiss({
      change: this.change,
    })
  }

  reset() {
    this.viewCtrl.dismiss({
      reset: true,
      change: true
    })
  }

  viewInvoice() {
    this.viewCtrl.dismiss({view: true, change: this.change});
    console.warn('Allez sur la page de print de la facture'); 
  }

  addLine() {
    if (this.line.label != '') {
      this.invoice.lines.push(this.line);
      this.line = {
        label: '',
        amount: 0
      }
      this.computeTotal();
    } 
  }

  deleteLine(index) {
    this.invoice.lines.splice(index, 1);
    this.computeTotal();
  }

  computeTotal() {
    let total = 0;
    this.invoice.lines.forEach( line => {
      total += Number(line.amount);
    })
    if (total != this.invoice.quotationTotal && !this.invoice.reg) {
      this.warning = true;
    } else {
      this.warning = false;
    }
    this.invoice.amount = total;
    this.setChange();
  }

  canSeeInvoice() {
    return (this.invoice.date && this.invoice.id && this.invoice.lines.length > 0) ? true : false;
  }

}
