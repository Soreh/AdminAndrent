import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Contract, ContractOption } from '../../../models/rentals/contract.interface';
import { STATUSCODE, STATUS } from '../../../models/global/status.interface';
import { RentalServiceProvider } from '../../../providers/rentals/rental-service/rental-service';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';
import { Rental } from '../../../models/rentals/rental.interface';

/**
 * Generated class for the ContractModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contract-modal',
  templateUrl: 'contract-modal.html',
})
export class ContractModalPage implements OnInit {

  public contract: Contract;
  //public specialClause: string;
  public change: boolean;

  private config: RentalConfig;

  public rental: Rental;

  public status = [
    {
      code : STATUSCODE.toBeSend,
      label : STATUS.getLabel(STATUSCODE.toBeSend),
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, private viewCtrl: ViewController,
    private rentalService: RentalServiceProvider,
    private alertCtrl: AlertController) {
  }


  ngOnInit(){
    if (this.navParams.get('contract')){
      this.contract = this.navParams.get('contract');
      this.config = this.rentalService.getConfig();
      if (this.navParams.get('rental')) {
        this.rental = this.navParams.get('rental');
      }
      if (!this.contract.options) {
        this.resetOptions();
      }
    }
  }

  ionViewDidLoad() {
  }

  setChange() {
    this.change = true;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  update() {
    this.viewCtrl.dismiss({
      contract: this.contract,
      change: true,
    })
  }

  seeContract() {
    if (this.rental) {
      this.viewCtrl.dismiss({
        dest: 'ContractPrintPage',
        rental: this.rental,
        contract: this.contract,
        change: false,
      })
    }
  }

  generateContract() {
    this.viewCtrl.dismiss({
      dest: 'ContractPrintPage',
      contract: this.contract,
      rental: this.rental,
      change: this.change,
    })
  }

  resetOptions() {
    this.contract.options = [];
    if (this.config.contractConditions) {
      // HARDCODED OPTIONS
      // LOCATIONS
      let locationList: ContractOption = {
        conditionId: 'locations',
        label: 'Espaces mis à disposition',
        isBool: false,
        value: false,
        list: []
      }
      let loc = this.config.locations.find(location => location.id === this.rental.location_id);
      locationList.list.push(loc.label);
      // DATES
      let datesList: ContractOption = {
        conditionId: 'dates',
        label: 'Dates de location',
        isBool: false,
        value: false,
        list: []
      }
      let dates = this.rental.dates;
      if (dates) {
        datesList.list.push(dates);
      }else {
        datesList.list.push('À préciser');
      }
      // SCHEDULE
      let scheduleList: ContractOption = {
        conditionId: 'schedule',
        label: 'Horaire précis',
        isBool: false,
        value: false,
        list: []
      }
      let schedule = this.rental.schedule;
      if (schedule) {
        scheduleList.list.push(schedule);
      } else {
        scheduleList.list.push('À fournir');
      }
      this.contract.options.push(locationList, datesList, scheduleList);
      // DYNAMICALY GENERATED OPTIONS
      this.config.contractConditions.forEach(condition => {
        let option: ContractOption = {
          conditionId: condition.id,
          label: condition.label,
          isBool: condition.isList ? false : true,
          value: false
        };
        if (condition.desc) {
          option.desc = condition.desc;
        }
        if (!option.isBool) {
          option.list = [];
        }
        let optionsThatMeetCondition = [];
        this.config.options.forEach(opt => {
          if (opt.contractConditionID === condition.id) {
            optionsThatMeetCondition.push({
              id: opt.id,
              label: opt.label
            });
          }
        })
        if (this.rental.quotation_args) {
          this.rental.quotation_args.details.forEach(detail => {
            let optionIsPresent = optionsThatMeetCondition.findIndex(optionTMC => optionTMC.id === detail.optionID);
            if (optionIsPresent >= 0) {
              if (option.isBool) {
                option.value = true;
              } else {
                if (!option.list) {
                  option.list = [];
                }
                option.list.push(optionsThatMeetCondition[optionIsPresent].label);
              }
            }
          })
        }
        this.contract.options.push(option);
      })
    }
  }

  removeFromList(list: any[], index) {
    list.splice(index, 1);
    this.setChange();
  }

  editListItem(listItem: string) {
    let alert = this.alertCtrl.create({
      title: 'Modifier un élément de la liste',
      inputs : [
        {
          name: 'label',
          type: 'text',
          value: listItem
        }
      ],
      buttons: [
        {
          text : 'Ok',
          handler: ((data)=>{
            listItem = data.label;
            this.setChange();
          })
        }
      ]
    });
    alert.present();
  }

  addItemToList(option) {
    let alert = this.alertCtrl.create({
      title: 'Ajouter un objet dans la liste',
      inputs: [
        {
          name: 'label',
          type: 'text',
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ajouter',
          handler: ((data) => {
            if (data.label) {
              option.list.push(data.label);
              this.setChange()
            }
          })
        }
      ]
    });
    alert.present();
  }

  public canModify() {
    return (this.contract.status_code === STATUSCODE.send || this.contract.status_code === STATUSCODE.approved) ? false : true;
  }

}
