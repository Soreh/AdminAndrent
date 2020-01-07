import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';

/**
 * Generated class for the NewRentalModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-rental-modal',
  templateUrl: 'new-rental-modal.html',
})
export class NewRentalModalPage {

  id: any;
  firstDate: any;

  constructor(
    public viewCtrl : ViewController, 
    public navParams: NavParams, 
    private struct: StructureServiceProvider) {
  }

  ionViewWillLoad() {
    if (this.navParams.get('firstDate')) {
      this.firstDate = this.navParams.get('firstDate');
    }
    this.struct.isStructureLoaded().then(()=>{
      this.struct.getCurrentId().then((id) => {
        this.id = id;
      });
    })
  }
  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
    //this.nav.setRoot('RentalsPage');
  }

}
