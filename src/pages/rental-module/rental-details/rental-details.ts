import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RentalServiceProvider} from "../../../providers/rentals/rental-service/rental-service";
import { Rental } from '../../../models/rentals/rental.interface';
import { STATUSCODE, STATUS } from "../../../models/global/status.interface";
import { Quotation } from '../../../models/rentals/quotation.class';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { Log } from '../../../models/rentals/log.interface';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
import { MODULES_KEYS } from "../../../providers/global/modules/modules";
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the RentalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rental-details',
  templateUrl: 'rental-details.html',
})
export class RentalDetailsPage {

  rentalID: any;
  rental$: Rental;
  quotationArgsExists : boolean;
  rentalStatuses = [
    {
      code : STATUSCODE.firstContact,
      label : STATUS.getLabel(STATUSCODE.firstContact)
    },
    {
      code : STATUSCODE.option,
      label : STATUS.getLabel(STATUSCODE.option)
    },
    {
      code : STATUSCODE.confirmed,
      label : STATUS.getLabel(STATUSCODE.confirmed)
    },
    {
      code : STATUSCODE.over,
      label : STATUS.getLabel(STATUSCODE.over)
    },
    {
      code : STATUSCODE.canceled,
      label : STATUS.getLabel(STATUSCODE.canceled)
    }
  ];
  //config_key;
  config : RentalConfig;
  showDetails : boolean = true; // Details are shown by default
  logMsg : string;
  changeMade : any[] = [
    'Statut',
    'Régisseur',
    'Dates'
  ];

  constructor(private rentalService: RentalServiceProvider, private navCtrl: NavController, public navParams: NavParams, public structService: StructureServiceProvider, private alertCtrl: AlertController ) {
  }

  /**
   * Deprecated ?
   */
  // getRentalDetails(){
  //   this.rentalService.mockGetRentalDetails(this.rentalID).subscribe(data => this.rental$ = data);
  // }

  ionWiewDidLoad() {
    console.log("ionViewDidLoad Rental Details");
  }

  ionViewWillLoad() {
    console.log("ionViewWillLoad Rental Details");
    if (!this.navParams.get('id')){
      console.error('No rental ID received');
      this.navCtrl.setRoot('ConnectPage');
    } else {
      this.rentalID = this.navParams.get('id');
      this.rental$ = this.rentalService.getRentalDetails(this.rentalID);
      this.config = this.rentalService.getConfig();
      // if ( this.rental.quotation_args ) {
      //   this.quotationArgsExists = true;
      // }
    }

    // if( !this.navParams.get('id') 
    //     || !this.navParams.get('config_key') ) {
    //       console.error('no param...');
    //       this.navCtrl.setRoot('ConnectPage');
    // } else {
    //       console.log('dans le else..');
    //       this.rentalID = this.navParams.get('id');
    //       this.config_key = this.navParams.get('config_key');
    //       console.log(this.rentalID);
    //       this.getRentalDetails();
    //       if ( this.rental.quotation_args ) {
    //         this.quotationArgsExists = true;
    //       }
    //       this.rentalService.mockGetOptionsByKey(this.config_key).subscribe(data =>        this.config = data
    //       );
    // }
  }

  ionViewWillEnter(){
    if(this.rental$){
      if ( this.rental$.quotation_args ) {
        this.quotationArgsExists = true;
      }
    }
  }
  /**
   * Has to move int the Quotation Class ?
   */
  outputQuotationStatus(){
    let label: string;
    let amount = '';
    let total : number;
    if ( this.quotationArgsExists ) {
      label = STATUS.getLabel(this.rental$.quotation_args.statusCode);
      if( this.rental$.quotation_args.total ){
        total = this.rental$.quotation_args.total.amount;
        if ( this.rental$.quotation_args.discount ) {
          total = total - this.rental$.quotation_args.discount;
        }
        amount = " | "+ total +"€";
      }
    } else {
      label = STATUS.getLabel(STATUSCODE.toDO);
    }
    return "Devis "+ label + amount;
  }

  /**
   * Utilities
   */

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  /**
   * Navigation
   */

  goToQuotationDash(){
    if ( this.quotationArgsExists ) {
      this.navCtrl.push('RentalQuotationDashPage',{
        data: {
          rentalID      : this.rentalID,
          quotationArgs : this.rental$.quotation_args,
          //config_key : this.config_key,
        }
      });
      console.log(this.rental$.quotation_args); 
    } else {
      // this.rental.quotation = new Quotation(this.rental.id, this.rental.quotation_args);
      this.navCtrl.push('RentalQuotationDashPage',{
        data: {
          rentalID      : this.rentalID,
          //config_key : this.config_key,
        }
      });
    }
  }

  /**
   * Save and Changes
   */

  /**
   * Set the changes track
   * @returns void
   */
  keepChangesTrack(): void {

  }

  /**
   * Save the details in DB and generate an log the changes track
   * @returns void
   */
  saveAndLog(): void {
    let msg : string;
    let modif : string;
    //let author : string = 'Seb';
    if (this.logMsg) {
      msg = this.logMsg
    }
    if ( this.changeMade ) {
      modif = 'Modification de :<ul>';
      // if(this.logMsg){
      //   modif += '<br>';
      // }
      this.changeMade.forEach(change => {
        modif += '<li>' + change + '</li>';
      });
      modif += '</ul>';
    }
    //   if (!this.logMsg ){
    //     author += ' (auto)';
    //   }
    //   msg += modif;
    // }
    // let log : Log = {
    //   author: author,
    //   date : new Date(),
    //   msg : msg,
    // }

    this.rentalService.log(this.rental$, modif, msg);
  }

  /**
   * Delete the current rental
   */
  deleteRental() : void {
    this.alertCtrl.create({
      title : "Attention",
      subTitle : "L'effacement de la location est défintive. Êtes-vous sûr.e de vouloir continuer ?",
      buttons : [
        {
          text : 'Annuler',
          role : 'cancel',
        },
        {
          text : "Oui, hein!",
          handler : () => {
            this.rentalService.deleteRental(this.rentalID);
            this.navCtrl.setRoot('RentalsPage');
          }
        }
      ]
    }).present();
  }

}
