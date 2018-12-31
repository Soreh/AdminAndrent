import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ContractPrintPage } from '../contract-print/contract-print';
import { Contract } from '../../../models/rentals/contract.interface';
import { STATUSCODE, STATUS } from '../../../models/global/status.interface';

/**
 * Generated class for the ContractModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contract-modal',
  templateUrl: 'contract-modal.html',
})
export class ContractModalPage implements OnInit {

  public contract: Contract;
  //public specialClause: string;
  public change: boolean;

  public status = [
    {
      code : STATUSCODE.toBeSend,
      label : STATUS.getLabel(STATUSCODE.toBeSend),
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
  }


  ngOnInit(){
    if (this.navParams.get('contract')){
      this.contract = this.navParams.get('contract');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractModalPage');
  }

  setChange() {
    this.change = true;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  update() {

    this.viewCtrl.dismiss({
      contract: this.contract,
      change: this.change,
    })
  }

  seeContract() {

    this.viewCtrl.dismiss({
      dest: 'ContractPrintPage',
      contract: this.contract,
      change: this.change,
    })
  }

}
