import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Invoice } from '../../../models/invoices/invoice.interface';
import { Structure } from '../../../models/global/structure.interface';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';

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
  public structure: Structure;

  constructor(public navCtrl: NavController, public navParams: NavParams, public struct: StructureServiceProvider) {
  }

  ngOnInit() {
    this.invoice = this.navParams.get('invoice');
    this.struct.getCurrentStructure().then(
      (data) => {
        if (data) {
          data.valueChanges().subscribe(
            (st) => {
              this.structure = <Structure>st;
            }
          );
        }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePrintPage');
  }

  close() {
    if ( this.navCtrl.canGoBack() ){
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('ConnectPage');
    }
  }

  goHome() {
    this.navCtrl.setRoot('StartPage');
  }

}
