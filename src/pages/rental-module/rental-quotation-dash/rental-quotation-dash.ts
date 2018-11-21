import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CategoryDetail } from '../../../models/rentals/category-detail.interface';
import { RentalConfig } from "../../../models/rentals/rentals-config.interface";
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { QuotationOption, savedOptionByCategory, Charge } from '../../../models/rentals/quotation-option.interface';
import { Quotation, QuotationDetails } from '../../../models/rentals/quotation.class';
import { QuotationverboseLine } from "../../../models/rentals/quotation-verbose-interface";
import { STATUSCODE } from "../../../models/global/status.interface";
/**
 * Generated class for the RentalQuotationDashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rental-quotation-dash',
  templateUrl: 'rental-quotation-dash.html',
})
export class RentalQuotationDashPage {

  public tabs = [
    {
      name : 'options',
      target : 'prices',
      show : false,
      class : "",
    },
    {
      name : 'calcul',
      target : 'compute',
      class : 'active',
      show : true,
    },
    {
      name : 'recap frais',
      target : 'recap',
      show : false,
      class : "",
    },
    {
      name : 'devis',
      target : 'verboseQuotation',
      show : false,
      class : "",
    }
  ];
  public priceList: CategoryDetail[];
  public config: RentalConfig;
  public linesToAdd : QuotationverboseLine[] = [];
  public variousOptionToAdd = {
    units : 1,
    optionID : 0,
    catID : 1,
    label : "",
    amount : "",
  }

  public variousChargeTypeToAdd : Charge;
  public formErrorMsg : string;
  public selectedIndex = 0;

  public quotation: Quotation;
  public sortedOptions: savedOptionByCategory[];

  constructor(private rentalService: RentalServiceProvider, private navCtrl: NavController, private navParams: NavParams, private alertCtrl : AlertController) {
  }
  
  showHelp() {
    const help = this.alertCtrl.create({
      title: "Ajouter une option",
      subTitle : 'Pour ajouter une option préenregistrée, rendez-vous dans l’onglet « option ». Pour ajouter une option libre, remplissez le formaulaire et cliquez sur "+" (tous les champs sont obligatoire).',
      buttons : ["J'ai compris !"],
    });
    help.present();
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad RentalQuotationDashPage');
    if(this.navParams.get('data')){
      let key = this.navParams.get('data').config_key;
      if(!key)
      {
        console.error('ERREUR : config_key manquante');
        this.navCtrl.setRoot('ConnectPage');
      }
      else
      {
        this.rentalService.mockGetOptionsByKey(this.navParams.get('data').config_key).subscribe(config => {
          console.log(config);
          this.config = config;
          this.priceList = this.rentalService.getPriceOptionsList(this.config);
        });
        if (!this.navParams.get('data').quotation){
          this.quotation = new Quotation();
        } else {
          this.quotation = this.navParams.get('data').quotation;
        }
        this.sortedOptions = this.quotation.getSortedOptions(this.config);
        if(this.quotation.verbose.categories){
          for (let catLength = 0; catLength < this.quotation.verbose.categories.length; catLength++) {
            this.linesToAdd.push({label:"",amount:0});
          }
        }
        this.variousChargeTypeToAdd = this.config.chargesTypeDetails[0];
      }
    } else {
      console.error("No params received");
      this.navCtrl.setRoot('ConnectPage');
    }

  }

  showTab(target) : void {
    this.tabs.forEach(tab => {
      tab.show = false;
      if (tab.class){
        tab.class="";
      }
      if (tab.target === target){
        tab.show = true;
        tab.class="active";
      }
    });
  }

  isShown(target) : boolean {
    return this.tabs.find(tab => tab.target === target).show;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentalQuotationDashPage');
  }

  /**
   * UTILITIES
   */

  updateSortedoption(): void {
    this.sortedOptions = this.quotation.getSortedOptions(this.config);
  }

  console(a): void {
    console.log(a);
  }

  getPostQuotationOptions() {
    var postOptions = [];
    var cat = this.sortedOptions.filter(option => option.isPost);
    cat.forEach(el => {
      el.options.forEach(option => {
        postOptions.push(option);
      });
    });
    return postOptions;
  }

  printOutQuotation(){
    console.log(this.quotation);
  }

  checkZero(number: number) {
    if (number != 0 ){
      if(number < 0) {
        return "alert";
      } else {
        return "green-alert";
      }
    }
  }

  checkFinalBalance(price, discount, cost){
    if(this.quotation.total.amount-this.quotation.discount-this.quotation.total.cost < 0){
      return "alert";
    }
  }

  checkFinalDiscount() {
    if(this.quotation.discount > (this.quotation.total.amount - this.quotation.total.cost)) {
      return "alert";
    }
  }

  isQuotationApproved() {
    if (this.quotation.statusCode === STATUSCODE.approved){
      return true;
    }
  }

  getBalance(option : QuotationOption) : number {
    return option.amount - option.cost;
  }

  getCatTotal(index : number, type : string) : number {
    var total = 0;
    this.sortedOptions[index].options.forEach(option => {
      switch (type) {
        case "amount":
          total += option.amount * option.unit;
          break;
        case "cost":
          total += option.cost * option.unit;
        case "balance":
          total = this.getCatTotal(index, "amount") - this.getCatTotal(index, "cost");
        default:
          break;
      };
    });
    return total;
  };


  /**
   * SAVED OPTIONS TAB
   */

  addOption(option : QuotationOption, quotation : Quotation) : void {
    if( !this.quotation.hasOption(option.id)){
      quotation.details.push({
        units : 1, // By default, I enter at least 1 unit
        optionID : option.id
      });
      this.updateSortedoption(); // Update of the saved Options - a bit tricky..:(
      this.computeTotal();
    }
  }


  /**
   * QUOTATION CALCULATION TAB
   */

  removeOption(option: QuotationOption) : void {
    console.log("in removeOption");
    console.log(option);
    this.quotation.removeSortedOption(option);
    this.updateSortedoption();
    this.computeTotal();
  }
  addVariousOption() : void {
     let option:QuotationDetails;
     if( this.variousOptionToAdd.label != ""
          && this.variousOptionToAdd.catID != 0
          && this.variousChargeTypeToAdd ) {
       option = {
         units : this.variousOptionToAdd.units,
         optionID : this.variousOptionToAdd.optionID,
         variousAmount : Number(this.variousOptionToAdd.amount),
         variousCatID : this.variousOptionToAdd.catID,
         variousLabel : this.variousOptionToAdd.label,
         variousCost : 0,
        }
        if (this.variousChargeTypeToAdd) {
          option.variousChargeId = this.variousChargeTypeToAdd.id;
          option.variousChargeTypeId = this.variousChargeTypeToAdd.chargeTypeId;
          option.variousCost = Number(this.variousChargeTypeToAdd.cost) * option.units;
        }
      }
    
    if( option ) {
      this.quotation.details.push(option);
      console.log("Added Option");
      console.log(option);
      this.clearVariousOptionToAdd();
      this.updateSortedoption();
      this.computeTotal();
    } else {
      this.formErrorMsg = "Tous les champs sont obligatoires, pour ajouter un type de coût, ou une catégorie, rendez-vous dans les options de configuration";
    }
  }

  hideMsg(): void {
    this.formErrorMsg = null;
  }


  clearVariousOptionToAdd() : void { 
    this.variousOptionToAdd = {
      units : 1,
      optionID : 0,
      catID : 1,
      label : "",
      amount : "",
    };

    this.variousChargeTypeToAdd = this.config.chargesTypeDetails[0];
    this.formErrorMsg = null;
  }

  computeTotal(){
    this.quotation.total = {
      amount: 0,
      cost : 0,
    };
    //console.log(this.savedOptions);
    this.sortedOptions.forEach(options => {
      if(!options.isPost){
        options.options.forEach(option => {
          this.quotation.total.amount += option.amount * option.unit;
          this.quotation.total.cost += option.cost * option.unit;
        });
      }
    });
  }

  /**
   * RECAP TAB
   */

  computeCostByChargeType(chargeTypeId) : number {
    var total = 0;
    this.sortedOptions.forEach(cat => {
      if(!cat.isPost){
        cat.options.forEach(option => {
          if (option.chargeTypeId === chargeTypeId){
            total += option.cost * option.unit;
          }
        });
      }
    });
    return total;
  }

  getChargeLabel(chargeId) : string {
    return this.getChargeById(chargeId).label;
  }

  getChargeUnits(chargeId, total) : number {
    var charge = this.getChargeById(chargeId);
    //console.log("dans getChargeUnit");
    if( charge ) {
      if ( charge.cost != 0 ) {
        return total / charge.cost;
      }
      else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getChargeCost(chargeId) {
    return this.getChargeById(chargeId).cost;
  }

  private getChargeById(chargeId) {
    return this.config.chargesTypeDetails.filter(charge => charge.id === chargeId)[0];
  }

  /**
   * VERBOSE TAB
   */
  
  isVerboseCorrect() : boolean {
    if(this.quotation.verbose) {
      if (this.quotation.verbose.amount - this.quotation.verbose.discount
         === this.quotation.total.amount - this.quotation.discount){
           return true;
         }
    }
  }

  deleteVerboseLine(catLabel, lineToDelete): void {
    var lines = this.quotation.verbose.categories.filter(cat => cat.label === catLabel)[0].lines;
    lines.splice( lines.lastIndexOf(lineToDelete) , 1);
    this.computeVerboseTotal();
  }

  addVerboseLine(catLabel, lineToAdd, index) : void {
    this.quotation.verbose.categories.filter(cat => cat.label === catLabel)[0].lines.push({
      label: lineToAdd.label,
      amount : lineToAdd.amount,
    });
    this.computeVerboseTotal();
    this.clearLine(index);
  }

  clearLine(index) : void {
    this.linesToAdd[index] = {
      label : '',
      amount :0,
    };
  }

  resetVerbose() : void {
    
    let noPostCatIds =[];
    this.config.categories.forEach(cat => {
      if (!cat.isPostQuotation) {
        noPostCatIds.push(cat.id);
      }
    });
    console.log("ids = " + noPostCatIds);
    let firstCatId = noPostCatIds.shift();
    let optionsOfCat1 = this.config.options.filter(option => option.catId === firstCatId);
    // let otherOptions = this.config.options.filter(option => option.catId != firstCatId)
    let otherOptions = [];
    noPostCatIds.forEach(id => {
      otherOptions.push(this.config.options.filter(option => option.catId === id)[0]);
    });
    // console.log('first cat id : ' + firstCatId);
    // console.log('option of Cat 1 = ');
    // console.log(optionsOfCat1);
    // console.log('other Options = ');
    // console.log(otherOptions);
    this.quotation.verbose.discount = this.quotation.discount;
    this.quotation.verbose.categories[0].lines = [];
    this.quotation.verbose.categories[1].lines = [];
    optionsOfCat1.forEach(configOption => {
      this.quotation.details.forEach(option => {
        if(option.optionID === configOption.id) 
        {
          this.quotation.verbose.categories[0].lines.push({
            amount : option.units * configOption.amount,
            label : configOption.label
          });
          console.log('ajouter line depuis le if de optionOfCat1 ID = ' + option.optionID);
        } else if (option.optionID === 0 && option.variousCatID === firstCatId) 
        {
          this.quotation.verbose.categories[0].lines.push({
            amount : option.variousAmount * option.units,
            label : option.variousLabel,
          });
          console.log('ajouter line depuis le if else de optionOfCat1 ID = ' + option.optionID);
        }
      });
    });
    otherOptions.forEach(configOption => {
      this.quotation.details.forEach(option => {
        if(option.optionID === configOption.id ){
          this.quotation.verbose.categories[1].lines.push({
            amount : option.units * configOption.amount,
            label : configOption.label
          });
          console.log('ajouter line depuis le if de otherOption ID = ' + option.optionID);
        } else if (option.optionID === 0 && noPostCatIds.some(id => id === option.variousCatID) ) {
          this.quotation.verbose.categories[1].lines.push({
            amount : option.variousAmount * option.units,
            label : option.variousLabel,
          });
          console.log('ajouter line depuis le if else de otherOption ID =' + option.optionID);
        }
      });
    });
    this.computeVerboseTotal();
  }

  computeVerboseTotal(): void {
    console.log("Dans computeVerboseTotal");
    this.quotation.verbose.amount = 0;
    this.quotation.verbose.categories.forEach(cat => {
      cat.lines.forEach(line => {
        this.quotation.verbose.amount += Number(line.amount);
        console.log(line);
        }
      );
    });
  }

  goToPrint() {
    this.navCtrl.push('RentalQuotationPrintPage', {
      quotation : {
        verbose : this.quotation.verbose,
        postQuotation : this.getPostQuotationOptions(),
      }
    });
  }

}
