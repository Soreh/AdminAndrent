import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { RentalServiceProvider} from "../../../providers/rentals/rental-service/rental-service";
import { Rental } from '../../../models/rentals/rental.interface';
import { STATUSCODE, STATUS } from "../../../models/global/status.interface";
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { isType } from '@angular/core/src/type';
import { Client } from '../../../models/invoices/client.interface';
import { Invoice } from '../../../models/invoices/invoice.interface';

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
export class RentalDetailsPage implements OnInit, OnDestroy {

  rentalID: any;
  rental$: Observable<Rental>;
  rentalSub: Subscription;

  rental: Rental;

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
  config : RentalConfig;
  showDetails : boolean = true; // Details are shown by default
  logMsg : string;
  changeMade : string[];

  public placeholderClient = "Client à définir";

  constructor(
    private rentalService: RentalServiceProvider, 
    private navCtrl: NavController, 
    public navParams: NavParams, 
    public structService: StructureServiceProvider, 
    private alertCtrl: AlertController,
    private loader: LoadingController,
    private modalCtrl: ModalController ) {
  }

  /** LIFE CYCLES
   *************************************/

  ngOnInit() {
    console.log("OnInit Rental Details");
    if (!this.navParams.get('id')){
      console.error('No rental ID received');
      this.navCtrl.setRoot('ConnectPage');
    } else {
      this.rentalID = this.navParams.get('id');
      // this.rental$ = this.rentalService.getRentalDetails(this.rentalID);
      this.rental$ = this.rentalService.getRentalDetails(this.rentalID).valueChanges();
      
      this._getRentalDetails();
      
      this.config = this.rentalService.getConfig();
    }
  }

  ionViewWillLoad() {
  }

  ionWiewDidLoad() {
    console.log("ionViewDidLoad Rental Details");
  }

  ionViewWillEnter(){
    //OOPPPS 
      if(this.rental){
        if ( this.rental.quotation_args ) {
          this.quotationArgsExists = true;
        }
      }
  }

  async ionViewCanLeave(){
    return new Promise<boolean>(
      resolve => {
        if (!this.changeMade) return resolve(true)
        const alert = this.alertCtrl.create({
          title: "Attention ici !",
          message: "Vous avez apporté des modifications à cette location, voulez-vous les sauvegarder ?",
          buttons: [
            {
              text: "Même pas en rève !",
              role: 'cancel',
              handler: () => {
                resolve(true);
              }
            },
            {
              text: "Allez, d'accord...",
              handler: (()=>{
                this.saveAndLog();
                resolve(true);
              }
              )
            }
          ]
        })
        alert.present()
      }
    );
  }

  ionViewWillLeave(){
  }

  ionViewDidLeave(){
  }
  
  ngOnDestroy(){
    if(this.rentalSub){
      this.rentalSub.unsubscribe();
      console.debug('Subscription on rental closed');
    }
  }
  
  /** CRUD
   *************************************/


  /**
   * Save the details in DB and generate an log the changes track
   * @returns void
   */
  saveAndLog(): void {
    let msg : string;
    let modif : string;
    if (this.logMsg) {
      msg = this.logMsg;
      this.logMsg = null;
    }
    if ( this.changeMade ) {
      modif = '[ Modification(s) apportée(s) : ';
      this.changeMade.forEach(change => {
        modif += change + ' ';
      });
      modif += ']';
      this.changeMade = null;
    }

    this.rentalService.log(this.rental, modif, msg).then(
      ()=> {
        try {
          this.rentalService.updateRental(this.rentalID, this.rental);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }


  async _getRentalDetails() {
    const load = await this.loader.create();
    this.rentalSub = await this.rental$.subscribe(
      async (rental) => {
        if (rental) {
          this.rental = rental;
          if (rental.quotation_args){
            this.quotationArgsExists = true;
          }
        }
        console.debug(this.rental);
        load.dismiss()
      }
    );

    await load.present();
  }

  /**
   * Delete the current rental
   */
  deleteRental() : void {
    this.alertCtrl.create({
      title : "Attention",
      subTitle : "L'effacement de la location est définitive. Êtes-vous sûr.e de vouloir continuer ?",
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


  /** UTILITIES 
   *************************************/

  /**
   * Set the changes track
   * @returns void
   */
  keepChangesTrack(field: string): void {
    if(!this.changeMade){
      this.changeMade = [];
    }
    const fieldIndex = this.changeMade.findIndex((change)=> change === field);
    if (fieldIndex === -1){
      this.changeMade.push(field);
    }
  }

  outputContractStatus() {
    let label: string;
    if(this.rental.contract) {
      label = "Convention " + STATUS.getLabel(this.rental.contract.status_code);
    } else {
      label = "Convention à faire";
    }
    return label;
  }

  outputInvoiceStatus() {
    let label: string;
    if(this.rental.invoice) {
      label = "Facture " + STATUS.getLabel(this.rental.invoice.status) + " | " + this.rental.invoice.amount + "€" 
    } else {
      label = "Facture à faire";
    }
    return label;
  }

  outputQuotationStatus(){
    let label: string;
    let amount = '';
    let total : number;
    if ( this.quotationArgsExists ) {
      label = STATUS.getLabel(this.rental.quotation_args.statusCode);
      if( this.rental.quotation_args.total ){
        total = this.rental.quotation_args.total.amount;
        if ( this.rental.quotation_args.discount ) {
          total = total - this.rental.quotation_args.discount;
        }
        amount = " | "+ total +"€";
      }
    } else {
      label = STATUS.getLabel(STATUSCODE.toDO);
    }
    return "Devis "+ label + amount;
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  /** NAVIGATION
   *************************************/

  openQuotationModal() {
    let data:any = {
      rentalID : this.rentalID,
    }
    if ( this.quotationArgsExists ) {
      data.quotationArgs = this.rental.quotation_args;
      console.log(this.rental.quotation_args); 
    }

    let modal = this.modalCtrl.create('QuotationModalPage', {
      quotationArgs: data.quotationArgs,
    });

    modal.onDidDismiss((data)=> {
      if(data){
        if(data.dest==="dash") {
          this.goToQuotationDash()
        } else if(data.dest==="see"){
          this.navCtrl.push('RentalQuotationPrintPage', {
            quotation: this.rental.quotation_args,
          } )
        }
      }
    })
    
    modal.present();
  }

  openClientModal() {
    if (!this.rental.client){
      let client:Client = {
        name: "",
      }
      this.rental.client = client;
    }

    let modal = this.modalCtrl.create('AddClientModalPage', {
      client: this.rental.client,
    })

    modal.onDidDismiss( (data) => {
      if (data) {
        this.keepChangesTrack('client');
      }
    })

    modal.present(); 
  }

  openContractModal() {
    if (!this.rental.contract) {
      this.rental.contract = {
        status_code: STATUSCODE.toBeSend,
      }
    }

    let modal = this.modalCtrl.create('ContractModalPage', {
      contract: this.rental.contract,
    })

    modal.onDidDismiss( (data) => {
      if (data) {
        if(data.change) {
          this.keepChangesTrack('Convention')
        }
        if(data.dest){
          this.navCtrl.push(data.dest, {
            contract: data.contract
          });
        }
      }
    })

    modal.present();
  }

  canOpenInvoice() {
    if (!this.rental.client || !this.rental.quotation_args){
      return true
    }
  }
  
  openInvoiceModal() {
    if (!this.rental.invoice){
      let invoice:Invoice = {
        // il faudra générer un id ?
        client: this.rental.client,
        amount: this.rental.quotation_args.total.amount,
        status: STATUSCODE.toBeSend,
      }
      this.rental.invoice = invoice;
    }

    let modal = this.modalCtrl.create('AddInvoiceModalPage', {
      invoice: this.rental.invoice,
    })

    modal.onDidDismiss( (data) => {
      if(data){
        if (data.change) {
          this.keepChangesTrack('facture');
        }
        if (data.view) {
          this.navCtrl.push('InvoicePrintPage', {
            invoice : this.rental.invoice,
          })
        }
      }
    })

    modal.present();
  }


  goToQuotationDash(){
    let data:any = {
      rentalID : this.rentalID,
    }
    if ( this.quotationArgsExists ) {
      data.quotationArgs = this.rental.quotation_args;
      console.log(this.rental.quotation_args); 
    }

    console.warn(data);

    this.navCtrl.push('RentalQuotationDashPage', {
      data: data,
    });
  }

}
