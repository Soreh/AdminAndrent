import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Structure } from '../../models/global/structure.interface';
import { RentalConfig } from '../../models/rentals/rentals-config.interface';
import { StructureServiceProvider } from '../../providers/global/structure-service/structure-service';
import { RentalServiceProvider } from '../../providers/rentals/rental-service/rental-service';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  public structure : Structure;
  public rentalConfig : RentalConfig;

  public loaded : boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public structService: StructureServiceProvider,
    public rentalService: RentalServiceProvider) {
      this.structService.getCurrentStructure().then( (doc) => {
        if ( doc ) {
          doc.get().then( (snap) => {
            this.structure = <Structure>snap.data();
            this.loaded = true;
          })
        } else {
          console.error("No current structure...");
          this.navCtrl.setRoot('StartPage');
        }
      }, (error) => { console.error(error)})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  update() {
    console.log('Il faut mettre à jour les options de config');
  }
}
