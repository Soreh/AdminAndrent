import { Component, Input, OnInit } from '@angular/core';
import { Quotationverbose } from '../../../models/rentals/quotation-verbose-interface';
import { NavController } from 'ionic-angular';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
import { Structure } from '../../../models/global/structure.interface';
import { Observable } from 'rxjs';

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
export class RentalQuotationVerboseComponent implements OnInit {

  @Input() verbose:Quotationverbose; 

  structure: Structure;

  constructor(private navCtrl: NavController, private struct: StructureServiceProvider) {
    console.log('Hello RentalQuotationVerboseComponent Component');
    
  }

  ngOnInit(){
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

  hasPostQuotation() {
    if (this.verbose.postQuotation && this.verbose.postQuotation.length > 0) {
      return true;
    }
  }

  emptyCat(cat) : boolean {
    if(cat.lines === []){
      return true;
    }
  }

  // emptyPostQuotation() : boolean {
  //   if (this.quotation postQuotation === []){
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

  isPostDiscounted(optionPost) {
    if (optionPost.normal_price && optionPost.normal_price > optionPost.price) {
      return true;
    }
  }

}
