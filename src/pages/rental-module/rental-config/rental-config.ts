import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';

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

  constructor(private rentalService : RentalServiceProvider, private user: UserServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalConfigPage');
  }

  ionViewWillLoad() {
    if(!this.user.isConnected()){
      console.warn('No user connected');
      this.navCtrl.setRoot('ConnectPage');
    } else {
      this.config = this.rentalService.getConfig();
      console.warn(this.config);
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
