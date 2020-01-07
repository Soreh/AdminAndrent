import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Contract, ContractOption, ContractPrint, ContractPrintArticle, ContractPrintPara } from '../../../models/rentals/contract.interface';
import { Rental } from '../../../models/rentals/rental.interface';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { PARAGRAPHCONDITIONTYPE } from '../../../models/global/constances';
import { ContractParagraph } from '../../../models/global/contract-scheme.interface';
import { STATUSCODE } from '../../../models/global/status.interface';
import { Structure } from '../../../models/global/structure.interface';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  public logoUrl = 'assets/imgs/logo-rc.png';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private rentalService: RentalServiceProvider, private struct: StructureServiceProvider, private loader: LoadingController) {
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

  public downloadPdf() {
    const loader = this.loader.create();
    loader.present();
    this.getPdf().then(
      () => {
        loader.dismiss();
      },
      (e) => {
        console.log(e);
        loader.dismiss()
      }
    );
  }

  generateContract() {
    this.contractPrint = {
      client: this.rental.client,
      date: this.contract.date,
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

  /**
   * Return the dataUrl from a local file as a promise
   */
  private _getDataUri(url) {
    return new Promise( (resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(image, 0, 0);
        const uri = canvas.toDataURL('image/png');
        resolve(uri);
      };
      image.src = url;
    });
  }

  async getPdf() {
    console.log('A implémenter');
    const logoUri = await this._getDataUri(this.logoUrl);
    let date = new Date(this.contract.date);
    console.log(date);
    const docDef = {
      info: {
        title: `Convention de location - ${this.rental.name}`,
      },
      content: [],
      styles: {
        identification: {
          italics: true,
          fontSize: 11,
          alignment: 'right',
          margin: [0, 5, 20, 5]
        },
        title: {
          fontSize: 25,
          alignment: 'right',
          margin: [0, 15, 20, 5]
        },
        articleTitle: {
          bold: true,
          margin: [0, 15, 0, 15],
          fontSize: 15,
        },
        para: {
          alignment: 'justify',
          margin: [15, 5, 0, 5]
        },
        alinea: {
          alignment: 'justify',
          margin: [35, 0, 0, 0]
        },
        list: {
          alignment: 'justify',
          margin: [35, 0, 0, 0]
        },
        subList: {
          alignment: 'justify',
          margin: [50, 0, 0, 0]
        },
        between: {
          bold: true,
          fontSize: 12,
          alignment: 'right',
          margin: [0, 10, 20, 0]
        },
        sign: {
          italics: true,
          alignment: 'center',
          margin: [0, 0, 0, 0]
        },
        alias: {
          bold: true,
          fontSize: 12,
          alignment: 'right',
          margin: [0, 0, 20, 0]
        }
      }
    };
    docDef.content.push({
      image: logoUri,
      width: 350
    });
    docDef.content.push({
      text: 'CONVENTION DE LOCATION',
      style:'title'
    });
    docDef.content.push({
      text: 'ENTRE',
      style: 'between'
    });
    docDef.content.push({
      text: `${this.structure.name}\n${this.structure.contact.number}, ${this.structure.contact.street} - ${this.structure.contact.cp} ${this.structure.contact.city}\nN° d'entreprise : ${this.structure.enterpriseNumber}\nreprésenté par Eric De Staercke, directeur,`,
      style: 'identification'
    });
    docDef.content.push({
      text: 'çi-après dénommé les R-C ;',
      style: 'alias'
    });
    docDef.content.push({
      text: 'ET',
      style: 'between'
    });
    docDef.content.push({
      text: `${this.contractPrint.client.name}\n${this.contractPrint.client.address}\n${this.structure.enterpriseNumber ? `N° d'entreprise : ${this.structure.enterpriseNumber}`: ``}${this.structure.vat ? `\nN° de TVA: ${this.structure.vat}`: ``}\nreprésenté par ${this.contractPrint.client.contact},`,
      style: 'identification'
    });
    docDef.content.push({
      text: 'çi-après dénommé le preneur ;',
      style: 'alias'
    });
    docDef.content.push({
      text: 'Il est convenu ce qui suit :',
      style: 'between'
    });
    this.contractPrint.articles.forEach((article, index) => {
      let artTitle = {
        text : `Art.${index + 1} - ${article.title.toLocaleUpperCase()}`,
        style: 'articleTitle',
      };
      docDef.content.push(artTitle);
      if (article.paragraphs) {
        article.paragraphs.forEach((para, index) => {
          docDef.content.push({
            text: `§${index + 1} ${para.text}`,
            style: 'para'
          });
          if (para.alineas) {
            para.alineas.forEach((alineas, index) => {
              let alinea = {
                text: `${index + 1}° ${alineas.text}`,
                style: 'alinea'
              }
              docDef.content.push(alinea);
              if (alineas.list) {
                if (alineas.list.length === 0) {
                  docDef.content.push({
                    text: '- Néant.',
                    style: 'subList',
                  })
                } else {
                  alineas.list.forEach( list => {
                    docDef.content.push({
                      text: `- ${list}`,
                      style: 'subList',
                    })
                  });
                }
              }
            })
          }
          if (para.list) {
            if (para.list.length === 0) (
              docDef.content.push({
                text: '- Néant.',
                style: 'list',
              })
            )
            para.list.forEach((list, index) => {
              let listItem = {
                text: `- ${list}`,
                style: 'list',
              }
              docDef.content.push(listItem);
            })
          }
        });
      }
    });
    docDef.content.push({
      text: `Fait à Bruxelles, en deux exemplaires le ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, chaque partie reconnaissant avoir reçu le sien.`,
      margin: [0, 10, 0, 5],
    })
    docDef.content.push({
      table : {
        widths: ['*', '*'],
        body: [
          [
            {
              text: `Pour les R-C :`,
              border: [false, false, false, false],
              style: 'sign'
            },
            {
              text: `Pour le preneur :`,
              border: [false, false, false, false],
              style: 'sign'
            }
          ],
          [
            {
              text: `Eric De Starcke, directeur`,
              border: [false, false, false, false],
              style: 'sign'
            },
            {
              text: `${this.contractPrint.client.contact}`,
              border: [false, false, false, false],
              style: 'sign'
            }     
          ]
        ]
      }
    })
    console.debug(docDef);
    let fileName = `Convention de location - ${this.rental.client.name}`;
    pdfMake.createPdf(docDef).download(fileName);
  }

}
