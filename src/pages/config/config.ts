import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Structure } from '../../models/global/structure.interface';
import { RentalConfig } from '../../models/rentals/rentals-config.interface';
import { StructureServiceProvider } from '../../providers/global/structure-service/structure-service';
import { RentalServiceProvider } from '../../providers/rentals/rental-service/rental-service';
import { MODULES_KEYS } from "../../providers/global/modules/modules";

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage implements OnInit {

  public structure : Structure;
  public rentalConfig : RentalConfig;

  public loaded : boolean;
  public tabs;

  public accountToAdd;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public structService: StructureServiceProvider,
    public rentalService: RentalServiceProvider) {
      this.tabs = [
        {
          name : 'general',
          target : 'global',
          show : true,
          class : "active",
        }
      ]; 
      this.accountToAdd = {
        label: '',
        bic: '',
        iban: '',
        main: true, 
      }
    }
    
  ngOnInit() {
    this.structService.getCurrentStructure().then( (doc) => {
      if ( doc ) {
        doc.valueChanges().subscribe(
          (sub) => {
            this.structure = <Structure>sub;
            this.loaded = true;
            this.rentalConfig = this.rentalService.getConfig();
          }
        )
        // doc.ref.get().then( (snap) => {
        //   this.structure = <Structure>snap.data();
        //   this.loaded = true;
        // })
      } else {
        console.error("No current structure...");
        this.navCtrl.setRoot('StartPage');
      }
    }, (error) => { console.error(error)})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  update() {
    console.log('Il faut mettre à jour les options de config');
    try {
      this.structService.updateCurrentStructure(this.structure);
    } catch (error) {
      console.warn(error);
    }
  }

  switchMainAccount(account: any, revert = true) {
    console.log(account.main);
    let main = account.main;
    if (revert){
      main = !main
    }
    if ( main ) {
      this.structure.bankAccount.forEach(
        (ac) => {
            ac.main = false;
          }
      );
      this.structure.bankAccount.find((acc)=> acc.iban === account.iban).main = true;
    }
  }

  addBankAccount(){
    console.log(this.accountToAdd);
    if( !this.structure.bankAccount ) {
      this.structure.bankAccount = [
        this.accountToAdd,
      ];
    } else {
      this.structure.bankAccount.push(this.accountToAdd);
      this.switchMainAccount(this.accountToAdd, false); 
    }
    this.accountToAdd = {
      label: '',
      bic: '',
      iban: '',
      main: false, 
    }
  }

  accountToAddValid(): boolean {
    if (
      this.accountToAdd.label != '' &&
      this.accountToAdd.bic != '' &&
      this.accountToAdd.iban != ''
    ) {
      return false 
    } else { return true }
  }

  /**
   * TABS
   */

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
}
