import { Component, Input, OnInit } from '@angular/core';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { AlertController, NavController, Alert } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Location } from "../../../models/rentals/location.interface";
import { CategoryDetail } from '../../../models/rentals/category-detail.interface';
import { OptionCategory, QuotationOption, ChargeType, Charge } from '../../../models/rentals/quotation-option.interface';
import { ThrowStmt } from '@angular/compiler';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';


/**
 * Generated class for the RentalsRentalConfigComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rental-config',
  templateUrl: 'rental-config.html'
})
export class RentalConfigComponent implements OnInit {

  @Input() config : RentalConfig;
  
  public op = 0;


  public calculatedCost = 0;
  public suggestedPrice = 0;
  
  public showAddForm: boolean = false;
  
  public newLoc: Location;
  public newCat: OptionCategory;
  public newChargeType: ChargeType;
  public newChargeDetails: Charge;

  public optionToAdd: QuotationOption;

  private alert: Alert;
  
  text: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: AngularFireDatabase,
    private rental: RentalServiceProvider) {
    console.log('Hello RentalConfigComponent Component');
    this.newLoc = {
      label : '',
      id: 0,
    };
    this.newCat = {
      label: '',
      id: 0,
    };
    this.newChargeType = {
      id: 0,
      label: '',
    };
    this.newChargeDetails = {
      id: 0,
      label: '',
      amount: 0,
      cost: 0,
      chargeTypeId: '',
    }

    this._emptyOptionToAdd();
  }

  showAdd() {
    if (this.showAddForm) {
      this.showAddForm = false;
    } else {
      this.showAddForm = true;
    }
    console.log(this.showAddForm);
  }

  getSuggestedPrice() {
    return `prix conseillé: ${this.suggestedPrice}€`
  }

  private _emptyOptionToAdd(): void {
    this.optionToAdd = {
      id : 'to create',
      label: '',
      amount : 0,
      cost: 0,
      catId: null,
      chargeId: null,
      unit: 0,
    }
    this.getCost();
  }
  //ngOnInit() {}

  ngOnInit() {
    console.log('Hello ! RentalconfigComponent');
    console.log(this.config);
    if(!this.config) {
      let alert = this.alertCtrl.create(
        {
          title : "Attention !",
          message: "Aucun fichier de configuration reçu, vous allez être rediriger vers la page d'accueuil.",
          buttons: [
            {
              text: "Ok ! C'est toi le boss !",
              handler: () => {
                this.navCtrl.setRoot('StartPage');
              }
            }
          ]
        }
      );
      alert.present();
    }
  }


  displayInfo(option: QuotationOption){
    // alert(msg);
    let msg: string = (option.infos)?option.infos:'';
    let alert = this.alertCtrl.create(
      {
        title: option.label,
        inputs: [
          {
            name: 'infos',
            placeholder: "Détails de l'option",
            type: 'textarea',
            value: msg,
          }
        ],
        buttons: [
          {
            text: 'Ok !',
            handler: data => {
              option.infos = data.infos;     
            }
          }
        ]
      }
    );
    alert.present();
  }

  getCost() {
    let price = 0;
    if ( this.optionToAdd.chargeId ) {
      price = this.config.chargesTypeDetails.find(charge => charge.id === this.optionToAdd.chargeId ).cost;
      console.log(price);
    }
    this.optionToAdd.cost = price * this.optionToAdd.unit;
    this.suggestedPrice = price * this.optionToAdd.unit * 1.5;
    this.optionToAdd.amount = this.suggestedPrice;
    console.log("newCost");
  }

  updateCost(option: QuotationOption) {
    option.cost = option.unit * this.config.chargesTypeDetails.find(charge => charge.id === option.chargeId).cost;
  }

  updateCostOnChargeTypeCost(charge: Charge) {
    this.config.options.forEach(
      (option) => {
        // Find the Quotation options that uses the charge
        if (option.chargeId === charge.id) {
          // update the cost of every specific quotation options
          this.updateCost(option);
        }
      }
    )
  }

  saveConfig() {
    this.rental.updateConfig(this.config).then(
      () => { console.log("Ok !")},
      (error) => { console.warn(error)} 
    );
  }


  /**
   * LOCATIONS
   */

   addLocation(){
    let locToAdd: Location = {
      label: this.newLoc.label.toString(),
    };
    locToAdd.id = this.db.createPushId();
    this.config.locations.push(locToAdd);
    this.newLoc.label = '';
  }

  async deleteToimplement() {
    this.alert = await this.alertCtrl.create( {
      title : "Attention !",
      message : "A implémenter, pour gérer la suppression des salles utilisées par des locations existantes.",
      buttons : [
        {
          text : 'C\'est toi le chef !',
          role : 'cancel',
        }
      ]
    });
    this.alert.present();
  }

  async deleteLocation(){
    // Warning ! What if a rental uses that location ?
    await this.deleteToimplement();
  }

  /**
   * ChargeType
   */

  addchargeType(){
    let chargeTypeToAdd: ChargeType = {
      label: this.newChargeType.label.toString(),
      id: this.db.createPushId(),
    }
    this.config.chargesTypes.push(chargeTypeToAdd);
    this.newChargeType.label = '';
  }

  modifyChargetype(){

  }

  deleteChargeType(){
    this.deleteToimplement();
  }

  /**
   * ChargeDetails
   */

  addChargeDetails(chargeTypeId: string){
    console.debug(chargeTypeId);
    let charge: Charge = {
      id : this.db.createPushId(),
      label: this.newChargeDetails.label,
      amount: this.newChargeDetails.amount,
      cost: this.newChargeDetails.cost,
      chargeTypeId: chargeTypeId,
    };
    let index = this.config.chargesTypes.findIndex(chargeType => chargeType.id === chargeTypeId);
    if ( index != -1) {
      if(!this.config.chargesTypes[index].chargesId){
        this.config.chargesTypes[index].chargesId = [];
      }
      this.config.chargesTypes[index].chargesId.push(charge.id);
      this.config.chargesTypeDetails.push(charge);
      this;this.newChargeDetails = {
        id : 0,
        label: '',
        amount: 0,
        cost: 0,
        chargeTypeId: '',
      }
    } else {
      console.error("Something went wrong... Charge not added");
      console.error(chargeTypeId);
      console.error(index);
    }
  }

  modifyChargeDetails(){

  }

  deleteChargeDetails(){
    this.deleteToimplement();
  }

  /**
   * Category
   */

  async addCategory() {
    this.alert = await this.alertCtrl.create( {
      message : "Voulez-vous ajouter cette catégorie comme une catégorie hors-devis ?",
      buttons : [
        {
          text : 'Oui',
          handler : () => {
            this._addCategory(true);
          }
        },
        {
          text : 'Non',
          handler : () => {
            this._addCategory(false);
          }
        },
      ]
    })
    return await this.alert.present();
  }

  private async _addCategory(isPostQuotation: boolean): Promise<void> {
    let catToAdd: OptionCategory = {
      id: this.db.createPushId(),
      label: this.newCat.label.toString(),
      isPostQuotation: isPostQuotation,
    };
    catToAdd.id = this.db.createPushId();
    if (isPostQuotation) {
      this.config.categories.push(catToAdd);
    } else {
      this.config.categories.unshift(catToAdd);
    }
    this.newCat.label = '';
  }
  
  modifyCategory() {

  }

  deleteCategory() {
    this.deleteToimplement();
  }

  /**
   * Option
   */
  
  addOption(){
    if ( this.optionToAdd.label != '' &&
          this.optionToAdd.amount != 0 &&
          this.optionToAdd.catId &&
          this.optionToAdd.chargeId) {
            console.log(this.optionToAdd);
            let option: QuotationOption = {
              id : this.db.createPushId(),
              label : this.optionToAdd.label,
              amount : this.optionToAdd.amount,
              cost: this.optionToAdd.cost,
              catId: this.optionToAdd.catId,
              chargeId: this.optionToAdd.chargeId,
              chargeTypeId: this._findChargeTypeId(this.optionToAdd.chargeId),
              unit: this.optionToAdd.unit,
            };
            if (this.optionToAdd.infos) {
              option.infos = this.optionToAdd.infos;
            }
            console.warn(option);
            this.config.options.push(option);
            this._emptyOptionToAdd();
    } else {
      console.error('Tous les champs sont obligatoires');
    }
  }

  private _findChargeTypeId(chargeId) {
    return this.config.chargesTypeDetails.find(charge => charge.id === chargeId).chargeTypeId;
  }

  modifyOption(){

  }

  deleteOption(){
    // Warning ! What if a quotation uses that option ?
    this.deleteToimplement();
  }
}
