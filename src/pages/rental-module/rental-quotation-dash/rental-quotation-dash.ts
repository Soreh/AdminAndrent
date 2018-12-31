import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CategoryDetail } from '../../../models/rentals/category-detail.interface';
import { RentalConfig } from "../../../models/rentals/rentals-config.interface";
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { QuotationOption, savedOptionByCategory, Charge } from '../../../models/rentals/quotation-option.interface';
import { Quotation, QuotationDetails, QuotationArgs } from '../../../models/rentals/quotation.class';
import { QuotationverboseLine } from "../../../models/rentals/quotation-verbose-interface";
import { STATUSCODE, STATUS, Status } from "../../../models/global/status.interface";
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { Console } from '@angular/core/src/console';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { Rental } from '../../../models/rentals/rental.interface';
import { convertUrlToSegments } from 'ionic-angular/umd/navigation/url-serializer';
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
export class RentalQuotationDashPage implements OnInit {

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
  public selectedIndex = 0;
  public status = [
    {
      code : STATUSCODE.toDO,
      label : STATUS.getLabel(STATUSCODE.toDO),
    },
    {
      code : STATUSCODE.processing,
      label : STATUS.getLabel(STATUSCODE.processing),
    },
    {
      code : STATUSCODE.send,
      label : STATUS.getLabel(STATUSCODE.send),
    },
    {
      code: STATUSCODE.approved,
      label: STATUS.getLabel(STATUSCODE.approved),
    }
  ]

  public toBeConfirmedCode = STATUSCODE.toBeConfirmed;
  
  public adminCost:number = 150;
  public rentalId;
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

  public quotation: Quotation;
  public sortedOptions: savedOptionByCategory[];

  constructor(
    private rentalService: RentalServiceProvider, 
    private navCtrl: NavController, 
    private navParams: NavParams, 
    private alertCtrl : AlertController, 
    private user : UserServiceProvider,
    private auth: AuthServiceProvider) {
  }
  
  showHelp() {
    const help = this.alertCtrl.create({
      title: "Ajouter une option",
      subTitle : 'Pour ajouter une option préenregistrée, rendez-vous dans l’onglet « option ». Pour ajouter une option libre, remplissez le formaulaire et cliquez sur "+" (tous les champs sont obligatoire).',
      buttons : ["J'ai compris !"],
    });
    help.present();
  }

  selectTabUponStatus() : void {
    console.log(this.quotation.statusCode);
    switch(this.quotation.statusCode) {
      case STATUSCODE.processing :
        this.showTab('compute');
        break
      case STATUSCODE.toDO :
        this.showTab('prices');
        break
      default :
        this.showTab('recap');
    }
  }

  ngOnInit() { 
    console.debug('ionViewWillLoad RentalQuotationDashPage');
    this.auth.isConnected().then( (ok) => {
      if ( ok ) {
        if (!this.rentalService.getConfig()) {
          this.auth.logOut();
          console.error('Have to move ! No config found !')
          this.navCtrl.setRoot('ConnectPage');
        } else {
          this.config = this.rentalService.getConfig();
          this.priceList = this.rentalService.getSortedByCategoryPriceList();
          if(this.navParams.get('data')) { // if some data is passed
            let data = this.navParams.get('data');
            console.log(data);
            let args = this.navParams.get('data').quotationArgs;
            let id = this.navParams.get('data').rentalID;
            if(id) { // If a rental id is passed
              this.rentalId = id;
              if(args) { // if there are args, then pass them to to constructor
                this.quotation = new Quotation(id, args);
              } else { // otherwise mak a empty and default quotation for the rental of rental id
                this.quotation = new Quotation(id);
              }
            } else {
              console.error("No rental ID received for the quotation to create.");
            }
          } else { //otherwise create a new empty quotation, and with no id, allow to open the page and just calculate
            this.quotation = new Quotation();
          }
          this.sortedOptions = this.quotation.getSortedOptions(this.config); // Could it be a method of the Quotation Class, like Quotation.getSortedDetails() (with no argument)
          if(this.quotation.verbose.categories){
            for (let catLength = 0; catLength < this.quotation.verbose.categories.length; catLength++) {
              this.linesToAdd.push({label:"",amount:0});
            }
          }
          this.variousChargeTypeToAdd = this.config.chargesTypeDetails[0]; // Sets a default ChargeType
          // Ici il faudrait choisir un onglet actif selon le code 
        }
      } else {
        console.error('Have to move ! No user connected !')
        this.navCtrl.setRoot('ConnectPage');
      }
    });
    

    // if(this.navParams.get('data')){
    //   let key = this.navParams.get('data').config_key;
    //   if(!key)
    //   {
    //     console.error('ERREUR : config_key manquante');
    //     this.navCtrl.setRoot('ConnectPage');
    //   }
    //   else
    //   {
    //     this.rentalService.mockGetOptionsByKey(this.navParams.get('data').config_key).subscribe(config => {
    //       console.debug(config);
    //       this.config = config;
    //       this.priceList = this.rentalService.getPriceOptionsList(this.config);
    //     });
    //     if (!this.navParams.get('data').quotation){
    //       this.quotation = new Quotation();
    //     } else {
    //       this.quotation = this.navParams.get('data').quotation;
    //     }
    //     this.sortedOptions = this.quotation.getSortedOptions(this.config);
    //     if(this.quotation.verbose.categories){
    //       for (let catLength = 0; catLength < this.quotation.verbose.categories.length; catLength++) {
    //         this.linesToAdd.push({label:"",amount:0});
    //       }
    //     }
    //     this.variousChargeTypeToAdd = this.config.chargesTypeDetails[0];
    //   }
    // } else {
    //   console.error("No params received");
    //   this.navCtrl.setRoot('ConnectPage');
    // }

  }

  ionViewDidEnter() {
    console.debug("ionView did enter...")
    if(this.quotation) {
      this.selectTabUponStatus();
    }
  }

  ionViewWillLeave() {
    console.log('ionview will leave');
    console.log(this.rentalId);
    if(this.rentalId){ // If a rentalId exists, we are modifying a rental, we thus have to persists the changes in that specific rental
      // Get the args
      let args: QuotationArgs = this.quotation.getQuotationArgs();
      console.log(args);
      let currentArgs:  QuotationArgs;
      // Retrieve the rental
      let rental:Rental;

      this.rentalService.getRentalDetails(this.rentalId).ref.get().then(
        async (storedRental) => {
          rental = <Rental>storedRental.data();
          if (rental.quotation_args) {
            currentArgs = rental.quotation_args;
          }
          // il faut comparer currentArgs et args
          rental.quotation_args = args;
          await this.rentalService.updateRental(this.rentalId, rental);
        },
        (error) => {
          console.error(error);
        }
      );

      
      // let change = true;
      // console.warn(currentArgs);
      // if (currentArgs){
      //   change = this.rentalService.compareQuotationArgs(args, currentArgs);
      // }
      // if( change ) {
      //   rental.quotation_args = args;
      //   if( rental.quotation_args.statusCode == STATUSCODE.toDO){
      //     rental.quotation_args.statusCode = STATUSCODE.processing;
      //   }
      //   this.rentalService.log(rental, "Devis modifié");
      //   console.warn('Devis sauvegardé');
      // } else {
      //   console.warn('No chnage made');
      // }
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
    console.debug('ionViewDidLoad RentalQuotationDashPage');
  }

  /**
   * UTILITIES
   */

  updateSortedoption(): void {
    this.sortedOptions = this.quotation.getSortedOptions(this.config);
  }

  // console(a): void {
  //   console.debug(a);
  // }

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
    if (this.quotation.statusCode === STATUSCODE.toBePaid){
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
    console.debug("in removeOption");
    console.debug(option);
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
         units : 1,
         optionID : this.variousOptionToAdd.optionID,
         variousAmount : Number(this.variousOptionToAdd.amount),
         variousCatID : this.variousOptionToAdd.catID,
         variousLabel : this.variousOptionToAdd.label,
         variousCost : 0,
        }
        if (this.variousChargeTypeToAdd) {
          option.variousChargeId = this.variousChargeTypeToAdd.id;
          option.variousChargeTypeId = this.variousChargeTypeToAdd.chargeTypeId;
          option.variousCost = Number(this.variousChargeTypeToAdd.cost) * this.variousOptionToAdd.units;
        }
      }
    
    if( option ) {
      this.quotation.details.push(option);
      console.debug("Added Option");
      console.debug(option);
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
    //console.debug(this.savedOptions);
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

   getCatLabel(catId): string {
     return this.config.categories.find(cat => cat.id === catId).label;
   }

  computeCostByChargeType(chargeTypeId) : number {
    var total = 0;
    this.sortedOptions.forEach(cat => {
      if(!cat.isPost){
        cat.options.forEach(option => {
          if (this.getChargeTypeId(option.chargeId) === chargeTypeId){
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

  getChargeTypeLabel(chargeId): string {
    let typeId = this.getChargeTypeId(chargeId);
    return this.config.chargesTypes.find(chargeType => chargeType.id == typeId).label;
  }

  getChargeTypeId(chargeId): string {
    // return this.config.chargesTypes.find(chargeType => chargeType.chargesId.)
    return this.getChargeById(chargeId).chargeTypeId;
  }

  getChargeUnits(chargeId, total) : number {
    var charge = this.getChargeById(chargeId);
    //console.debug("dans getChargeUnit");
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
    
    let catIdsList = []; // je créé une variable pour stocker les catégories du verbose quotation
    this.quotation.verbose.discount = this.quotation.discount;
    this.quotation.verbose.categories = [];
    this.linesToAdd = [];

    // Je récupère les ID des catégories qui ne sont pas post
    let noPostCatIds =[];
    this.config.categories.forEach(cat => {
      if (!cat.isPostQuotation) {
        noPostCatIds.push(cat.id);
      }
    });

    // Je récupère les options por chacune des catégories qui ne sont pas post
    let options: QuotationOption[] = [];
    noPostCatIds.forEach(id => {
      options = options.concat(this.config.options.filter(option => option.catId === id));
      // options.push(this.config.options.filter(option => option.catId === id));
    })
    console.log(options);

    // Je vérifie si le devis en cours contient l'une ou l'autre de ces options
    this.quotation.details.forEach(quotationOption => {
      console.log(quotationOption);
      let optionToCompute: any;
      
      let option = options.find(option => option.id === quotationOption.optionID);
      
      if (option) {
        console.log(option);
        optionToCompute = {
          catId: option.catId,
          amount: option.amount,
          label:option.label
        }

      } else if (quotationOption.optionID === 0) {
        console.log('il faut gérer un customOption');
        optionToCompute = {
          catId: quotationOption.variousCatID,
          amount: quotationOption.variousAmount,
          label: quotationOption.variousLabel,
        }
      } else {
        console.log("C'est une option hors devis - ne rien faire");
      }

      if (optionToCompute) {
        if( catIdsList.findIndex(id => id === optionToCompute.catId) === -1 ) {
          console.log(this.getCatLabel(optionToCompute.catId));
          this.linesToAdd.push({label:"",amount:0});
          this.quotation.verbose.categories.push({
            id: optionToCompute.catId,
            label: this.getCatLabel(optionToCompute.catId),
            lines: [
              {
              amount: optionToCompute.amount,
              label: optionToCompute.label,
              }
            ]
          })
          catIdsList.push(optionToCompute.catId);
          console.log(catIdsList);
        } else {
          this.quotation.verbose.categories.find(cat => cat.id === optionToCompute.catId).lines.push({
            amount: optionToCompute.amount,
            label: optionToCompute.label
          })
      }

      }
    })

    // console.debug("ids = " + noPostCatIds);
    // let firstCatId = noPostCatIds.shift();
    // let optionsOfCat1 = this.config.options.filter(option => option.catId === firstCatId);
    // // let otherOptions = this.config.options.filter(option => option.catId != firstCatId) 
    // let otherOptions = [];
    // noPostCatIds.forEach(id => {
    //   otherOptions.push(this.config.options.filter(option => option.catId === id)[0]);
    // });
    // // console.debug('first cat id : ' + firstCatId);
    // // console.debug('option of Cat 1 = '); 
    // // console.debug(optionsOfCat1);
    // // console.debug('other Options = ');
    // // console.debug(otherOptions); 
    // this.quotation.verbose.discount = this.quotation.discount;
    // this.quotation.verbose.categories[0].lines = [];
    // this.quotation.verbose.categories[1].lines = [];
    // optionsOfCat1.forEach(configOption => {
    //   this.quotation.details.forEach(option => {
    //     if(option.optionID === configOption.id) 
    //     {
    //       this.quotation.verbose.categories[0].lines.push({
    //         amount : option.units * configOption.amount,
    //         label : configOption.label
    //       });
    //       console.debug('ajouter line depuis le if de optionOfCat1 ID = ' + option.optionID);
    //     } else if (option.optionID === 0 && option.variousCatID === firstCatId) 
    //     {
    //       this.quotation.verbose.categories[0].lines.push({
    //         amount : option.variousAmount * option.units,
    //         label : option.variousLabel,
    //       });
    //       console.debug('ajouter line depuis le if else de optionOfCat1 ID = ' + option.optionID);
    //     }
    //   });
    // });
    // otherOptions.forEach(configOption => {
    //   this.quotation.details.forEach(option => {
    //     if(option.optionID === configOption.id ){
    //       this.quotation.verbose.categories[1].lines.push({
    //         amount : option.units * configOption.amount,
    //         label : configOption.label
    //       });
    //       console.debug('ajouter line depuis le if de otherOption ID = ' + option.optionID);
    //     } else if (option.optionID === 0 && noPostCatIds.some(id => id === option.variousCatID) ) {
    //       this.quotation.verbose.categories[1].lines.push({
    //         amount : option.variousAmount * option.units,
    //         label : option.variousLabel,
    //       });
    //       console.debug('ajouter line depuis le if else de otherOption ID =' + option.optionID);
    //     }
    //   });
    // });
    this.computeVerboseTotal();
  }

  computeVerboseTotal(): void {
    console.debug("Dans computeVerboseTotal");
    this.quotation.verbose.amount = 0;
    this.quotation.verbose.categories.forEach(cat => {
      cat.lines.forEach(line => {
        this.quotation.verbose.amount += Number(line.amount);
        console.debug(line);
        }
      );
    });
  }

  goToPrint() {
    // this.rentalService.getRentalDetails(this.rentalId).quotation_args.statusCode = STATUSCODE.toBeSend;
    this.navCtrl.push('RentalQuotationPrintPage', {
      quotation : {
        verbose : this.quotation.verbose,
        postQuotation : this.getPostQuotationOptions(),
      }
    });
  }

}
