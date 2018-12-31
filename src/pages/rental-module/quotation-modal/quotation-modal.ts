import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Quotation, QuotationArgs } from '../../../models/rentals/quotation.class';
import { STATUS, STATUSCODE} from '../../../models/global/status.interface'

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
  public quotation_status;
  public destination: string;

  public status = [
    {
      code : STATUSCODE.toDO,
      label : STATUS.getLabel(STATUSCODE.toDO),
    },
    {
      code : STATUSCODE.processing,
      label : STATUS.getLabel(STATUSCODE.processing),
    },
    {
      code : STATUSCODE.send,
      label : STATUS.getLabel(STATUSCODE.send),
    },
    {
      code: STATUSCODE.approved,
      label: STATUS.getLabel(STATUSCODE.approved),
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.quotation_args = this.navParams.get('quotationArgs');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationModalPage');
  }
  

  close() {
    this.viewCtrl.dismiss();
  }

  canEdit() {
    if ( this.quotation_args.statusCode === STATUSCODE.toBeSend ||
          this.quotation_args.statusCode === STATUSCODE.toDO ||
          this.quotation_args.statusCode === STATUSCODE.processing ) return true
  }
  // update() {
  //   this.viewCtrl.dismiss({stat : this.quotation_args.statusCode });
  // } 
  
  goToDash(){
    this.destination = "dash";
    this.viewCtrl.dismiss({dest : this.destination });
  }
  
  seeVerbose(){
    this.destination = "see";
    this.viewCtrl.dismiss({dest : this.destination });
  }
}
