import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Structure } from '../../../models/global/structure.interface';
import { UserServiceProvider } from '../../../providers/global/user-service/user-service';
import { StructureServiceProvider } from '../../../providers/global/structure-service/structure-service';
import { NavController, LoadingController, Loading, Config } from 'ionic-angular';
import { MODULES, MODULES_KEYS, ModulesProvider } from '../../../providers/global/modules/modules';
import { ModuleLoader } from 'ionic-angular/umd/util/module-loader';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserProfile } from '../../../models/global/user-profile.interface';
import { User } from 'firebase';
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
    private user: UserServiceProvider, 
    private struct: StructureServiceProvider, 
    private navCtrl: NavController, private modCtrl : ModulesProvider,
    public loadCtrl: LoadingController) {

    console.log('Hello AddstructureComponent Component');
    console.log(this.userID);
    //const rentalConfigKey = this.modCtrl.createDefaultRentalConfig();
    //this.user.getAuthUser().subscribe((user:User)=> this.userID = user.uid);
    this.modulesAvailable = [
      {
        module_key : MODULES_KEYS.rental,
      }
    ]
    
  }

  async saveStructure() {
    // const id = await this.struct.saveStructure(this.structureToAdd).then(
    //   (id) => {
    //     const struct_meta = {
    //       key : id,
    //       isDefault : true,
    //     };
    //     if (this.user.connectedUser$.structures) {
    //       struct_meta.isDefault = false;
    //     };
    //     this.user.getConnectedUser().structures.push(struct_meta);
    //   }
    // );
    // let modules = [];
    // this.structureToAdd.modules.forEach(mod => async function() {
    //   const config = await this.modCtrl.createDefaultRentalConfig();
    //   modules.push({
    //     key : mod.module_key,
    //     config_key : config,
    //   })
    // });
    // let neededModules = {
    //   rental : false,
    // }
    
    // this.structureToAdd.modules.forEach(mod => async function(){
    //   if(mod.module_key === MODULES_KEYS.rental) {
    //     mod.config_key = await this.modCtrl.createDefaultRentalConfig();
    //   }
    // })
    
    // if(this.structureToAdd.modules.findIndex(mod => mod.module_key === MODULES_KEYS.rental) >= 0){
    //   const rentalDefaultConfig = await this.modCtrl.createDefaultRentalConfig();
    //   let index = this.structureToAdd.modules.findIndex(mod => mod.module_key === MODULES_KEYS.rental)
    //   this.structureToAdd.modules[index].config_key = rentalDefaultConfig;
    // }
    // console.log(this.structureToAdd.modules);
    // const id = await this.struct.saveStructure(this.structureToAdd);
    // if ( id ) {
    //   // ici ça déconne...
    //   console.log(this.user.getProfile(this.userID));
    //   //let profile: UserProfile = this.user.getConnectedUser();
    //   const struct_meta = 
    //   [
    //     {
    //     key : id,
    //     isDefault: this.isDefault,
    //     }
    //   ]
    //   // if (!profile.structures) {
    //   //   profile.structures = [];
    //   // } else {
    //   //   struct_meta.isDefault = false;
    //   // }
    //   //profile.structures.push(struct_meta);
    //   if (this.user.updateProfile(this.userID, 'structures', struct_meta, false)) {
    //     this.navCtrl.setRoot('StartPage');
    //   } else {
    //     console.error('Something went wrong...');
    //   }
    // }
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
    console.log(this.structureToAdd);
    this.loading = await this.loadCtrl.create();
    this.loading.present();
  }

  getModName(key) : string {
    return this.modCtrl.getModuleName(key);
  }

}
