import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RentalQuotationPrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rental-quotation-print',
  templateUrl: 'rental-quotation-print.html',
})
export class RentalQuotationPrintPage {

  quotation : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    if(this.navParams.get('quotation')) {
      this.quotation = this.navParams.get('quotation');
    } else {
      console.error('no Quotation received...');
    }
  }
  ionViewDidLoad() {
  }

  ionViewWillLeave() {
    
  }

  emptyCat(cat) : boolean {
    if(cat.lines === []){
      return true;
    }
  }

  emptyPostQuotation() : boolean {
    if (this.quotation.postQuotation === []){
      return true;
    }
  }

  goBack(){
    if ( this.navCtrl.canGoBack() ){
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('ConnectPage');
    }
  }

}
