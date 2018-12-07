import { Component, Input, OnInit } from '@angular/core';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { AlertController, NavController, Alert } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Location } from "../../../models/rentals/location.interface";
import { CategoryDetail } from '../../../models/rentals/category-detail.interface';
import { OptionCategory, QuotationOption } from '../../../models/rentals/quotation-option.interface';


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
  
  public newLoc: Location;
  public newCat: OptionCategory;

  public optionToAdd: QuotationOption;

  private alert: Alert;
  
  text: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: AngularFireDatabase) {
    console.log('Hello RentalConfigComponent Component');
    this.newLoc = {
      label : '',
      id: 0,
    };
    this.newCat = {
      label: '',
      id: 0,
    }

    this._emptyOptionToAdd();
  }

  private _emptyOptionToAdd(): void {
    this.optionToAdd = {
      id : this.db.createPushId(),
      label: '',
      catId: 0,
      amount : 0,
      cost: 0,
    }
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


  displayInfo(msg: string ){
    alert(msg);
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

  async deleteLocation(){
    // Warning ! What if a rental uses that location ?
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
