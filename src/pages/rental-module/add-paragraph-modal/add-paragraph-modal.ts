import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ContractParagraph } from '../../../models/global/contract-scheme.interface';
import { PARAGRAPHCONDITIONTYPE } from "../../../models/global/constances";
import { RentalConfig, ContractCondition } from '../../../models/rentals/rentals-config.interface';

/**
 * Generated class for the AddParagraphModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-paragraph-modal',
  templateUrl: 'add-paragraph-modal.html',
})
export class AddParagraphModalPage {
  public config: RentalConfig;

  public paragraph: ContractParagraph;
  public conditionTypes = PARAGRAPHCONDITIONTYPE;
  public edit = false;
  public conditionOrList = 'non';
  public listConditions: ContractCondition[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.config = this.navParams.get('config');
    this.listConditions = this.config.contractConditions.filter(condition => condition.isList === true);
    if (this.navParams.get('para')) {
      this.paragraph = this.navParams.get('para');
      this.edit = true;
      
    } else {
      this.paragraph = {
        text: '',
        condition: false
      }
    }
  }

  ionViewDidLoad() {
    this.conditionOrList = this.paragraph.condition ? 'condition' : this.paragraph.listAuto ? 'list' : 'non';
  }
  cancel() {
    this.viewCtrl.dismiss();
  }

  add() {
    this.viewCtrl.dismiss(this.paragraph);
  }

  applyChoice() {
    this.paragraph.condition = this.conditionOrList === 'condition' ? true : false;
    this.paragraph.listAuto = this.conditionOrList === 'list' ? true : false;
    if (this.paragraph.condition) {
      if (!this.paragraph.type) {
        this.paragraph.type = this.conditionTypes.show;
      }
    }
  }

  canAdd() {
    return this.paragraph.condition ? this.paragraph.conditionID ? true : false : this.paragraph.listAuto ? this.paragraph.listModel ? true : false : true;
  }
}
