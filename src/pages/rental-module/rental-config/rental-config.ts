import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';

/**
 * Generated class for the RentalConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rental-config',
  templateUrl: 'rental-config.html',
})
export class RentalConfigPage {

  public config : RentalConfig;

  constructor(
    private rentalService : RentalServiceProvider, 
    private user: UserServiceProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private struct: StructureServiceProvider) {
      this.config = this.rentalService.getConfig();
      // this.rentalService.getConfig().then( (data) => {
      //   this.config = data;
      //   console.debug(data);
      // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalConfigPage');
  }

  ionViewWillLoad() {
    this.config = this.rentalService.getConfig();
    if (!this.config) {
      console.error('Have to move, no config found...');
      this.navCtrl.setRoot('StartPage');
    }
  }

  displayInfo(msg: string ){
    alert(msg);
  }

  /**
   * LOCATIONS
   */

  addLocation(){

  }

  modifyLocation(){

  }

  deleteLocation(){
    // Warning ! What if a rental uses that location ?
  }

  /**
   * ChargeType
   */

  addchargeType(){
    
  }

  modifyChargetype(){

  }

  deleteChargeType(){

  }

  /**
   * Category
   */

  addCategory() {
    
  }
  
  modifyCategory() {

  }

  deleteCategory() {

  }

  /**
   * Option
   */
  
  addOption(){

  }

  modifyOption(){

  }

  deleteOption(){
    // Warning ! What if a quotation uses that option ?
  }
}
