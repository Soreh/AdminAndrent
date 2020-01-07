import { Component, Input, OnInit } from '@angular/core';
import { Structure } from '../../../models/global/structure.interface';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { MODULES_KEYS, ModulesProvider } from '../../../providers/global/modules/modules';
import { Subscription } from 'rxjs';
import { RentalConfig } from '../../../models/rentals/rentals-config.interface';

/**
 * Generated class for the AddstructureComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-structure',
  templateUrl: 'add-structure.html'
})
export class AddStructureComponent  implements OnInit {
  ngOnInit(): void {
    this.structureToAdd = {
      name:'',
      contact: {
        number: 0,
        street : '',
        city : '',
      },
      users :[
        {
          user_key : this.userID,
          isAdmin : true,
        }
      ],
    }
  }
  

  @Input() isDefault : boolean = false;
  @Input() userID : string;

  structureToAdd: Structure;
  modulesAvailable;
  authUser$ : Subscription;
  
  modulesToSetup = [
    MODULES_KEYS.rental,
  ];

  loading: Loading;

  constructor(
    private struct: StructureServiceProvider, 
    private navCtrl: NavController, private modCtrl : ModulesProvider,
    public loadCtrl: LoadingController) {

    //const rentalConfigKey = this.modCtrl.createDefaultRentalConfig();
    //this.user.getAuthUser().subscribe((user:User)=> this.userID = user.uid);
    this.modulesAvailable = [
      {
        module_key : MODULES_KEYS.rental,
      }
    ]
    
  }

  async saveStructure() {

  }

  /**
   * 
   */
  async addStructure(): Promise<void> {
    //console.log("il faut renvoyer les données de la structure à ajouter");
    if (this.modulesToSetup) {
      if(! this.structureToAdd.modules ){
        this.structureToAdd.modules = [];
      }
      this.modulesToSetup.forEach(mod => {
        let config: RentalConfig;
        if (mod === MODULES_KEYS.rental) {
          config = this.modCtrl.createDefaultRentalConfig();
        }
        this.structureToAdd.modules.push({
          module_key : mod,
          config : config,
        })
      });
    }
    if (this.structureToAdd.name != ''){
      this.struct.addStructure(this.structureToAdd, this.isDefault).then( 
        () => {
          this.loading.dismiss();
          this.navCtrl.setRoot('StartPage');
        },
        (e) => {
          console.debug(`error : ${e.message}`);
        });
    }
    this.loading = await this.loadCtrl.create();
    this.loading.present();
  }

  getModName(key) : string {
    return this.modCtrl.getModuleName(key);
  }

}
