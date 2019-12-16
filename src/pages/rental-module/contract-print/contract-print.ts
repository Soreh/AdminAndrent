import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contract, ContractOption, ContractPrint, ContractPrintArticle, ContractPrintPara } from '../../../models/rentals/contract.interface';
import { Rental } from '../../../models/rentals/rental.interface';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { PARAGRAPHCONDITIONTYPE } from '../../../models/global/constances';
import { ContractParagraph } from '../../../models/global/contract-scheme.interface';
import { STATUSCODE } from '../../../models/global/status.interface';
import { Structure } from '../../../models/global/structure.interface';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';

/**
 * Generated class for the ContractPrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contract-print',
  templateUrl: 'contract-print.html',
})
export class ContractPrintPage {

  private contract: Contract;
  private contractOptions: ContractOption[];
  private rental: Rental;
  public structure: Structure;
  
  public contractPrint: ContractPrint;
  public mainBankAccount;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private rentalService: RentalServiceProvider, private struct: StructureServiceProvider) {
  }

  ngOnInit() {
    this.struct.getCurrentStructure().then(
      (data) => {
        if (data) {
          data.valueChanges().subscribe(
            (st) => {
              this.structure = <Structure>st;
              let bankAccount = this.structure.bankAccount.find(ac => ac.main === true);
              console.log(bankAccount);
              this.mainBankAccount= {
                iban: bankAccount.iban
              }
            }
          );
        }
      }
    );
  }

  ionViewWillEnter() {
    this.rental = this.navParams.get('rental');
    console.log(this.rental);
    if (this.rental) {
      this.contract = this.rental.contract;
      this.contractOptions = this.rental.contract.options;
      this.generateContract();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractPrintPage');
  }

  close() {
    if ( this.navCtrl.canGoBack() ){
      this.navCtrl.pop();
    } else {
      this.goHome();
    }
  }

  goHome() {
    this.navCtrl.setRoot('StartPage');
  }

  generateContract() {
    this.contractPrint = {
      client: this.rental.client,
      articles: []
    };
    let rentalConfig = this.rentalService.getConfig();
    rentalConfig.rentalContractScheme.article.forEach( article => {
      let newArt: ContractPrintArticle = {
        title: article.title,
        paragraphs: []
      };
      article.paragraphs.forEach( para => {
        let paraToInsert: ContractPrintPara = {
          text: para.text
        }
        if (para.paragraphs) {
          paraToInsert.alineas = [];
          for (let index = 0; index < para.paragraphs.length; index++) {
            const alinea = para.paragraphs[index];
            if (!alinea.condition) {
              let printAlinea: ContractPrintPara = {
                text: alinea.text
              }
              if (alinea.listAuto) {
                printAlinea.list = this.getOptionList(alinea.listModel);
              }
              paraToInsert.alineas.push(printAlinea);
            } else {
              let condPrintAlinea = this.checkCondition(alinea.conditionID, alinea);
              if (condPrintAlinea) {
                paraToInsert.alineas.push(condPrintAlinea);
              }
            }           
          }
        }
        if (para.condition) {
          paraToInsert = this.checkCondition(para.conditionID, para);
        } else if (para.listAuto) {
          paraToInsert.list = this.getOptionList(para.listModel);
        }
        if (paraToInsert) {
          newArt.paragraphs.push(paraToInsert);
        }
      })
      this.contractPrint.articles.push(newArt);
    });
  }

  private getOptionList(listModel: string) {
    let autoList = this.contractOptions.find(option => option.conditionId === listModel).list;
    let list = [];
    if (autoList) {
      list = autoList;
    }
    return list;
  }

  private checkCondition(conditionId: string, para: ContractParagraph): ContractPrintPara {
    let option = this.contractOptions.find(option => option.conditionId === conditionId);
    let insertPara = true;
    let paraToInsert: ContractPrintPara = {
      text: para.text,
    };
    if (option.isBool) {
      switch (para.type) {
        case PARAGRAPHCONDITIONTYPE.replacementText:
          if (option.value) {
            paraToInsert.text = para.replacementText;
          }
          break;
        case PARAGRAPHCONDITIONTYPE.show:
          if (!option.value) {
            insertPara = false;
          }
        default:
          break;
      }
    } else {
      paraToInsert.list = option.list
    }
    if (insertPara) {
      return paraToInsert
    } else {
      return null
    }
  }

  getPdf() {
    console.log('A implémenter');
    alert('To implement !');
  }

}
