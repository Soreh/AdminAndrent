import { Component, Input } from '@angular/core';
import { Quotationverbose } from '../../../models/rentals/quotation-verbose-interface';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the RentalQuotationVerboseComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rental-quotation-verbose',
  templateUrl: 'rental-quotation-verbose.html'
})
export class RentalQuotationVerboseComponent {

  @Input() verbose:Quotationverbose;

  constructor(private navCtrl: NavController) {
    console.log('Hello RentalQuotationVerboseComponent Component');
  }

  emptyCat(cat) : boolean {
    if(cat.lines === []){
      return true;
    }
  }

  // emptyPostQuotation() : boolean {
  //   if (this.quotation.postQuotation === []){
  //     return true;
  //   }
  // }

  goBack(){
    if ( this.navCtrl.canGoBack() ){
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('ConnectPage');
    }
  }

}
