import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from "../../models/global/user.interface";
import { ModulesProvider } from '../../providers/global/modules/modules';
import { StructureServiceProvider } from '../../providers/global/structure-service/structure-service';
import { Structure } from '../../models/global/structure.interface';
import { UserServiceProvider } from '../../providers/global/user-service/user-service';

/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  public structureToCreate : Structure;
  
  public loadedModules;
  public structures$;
  public defaultStructure$;
  public loadedStructure$;

  public connectedUser$ : User;
  public otherStructures : any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private modulesService: ModulesProvider, 
    private structService : StructureServiceProvider,
    private user : UserServiceProvider) {

  }

  ionViewWillLoad() {
    console.log('ionViewDidLoad StartPage');
    this.connectedUser$ = this.user.getConnectedUser();
    if (this.user.getConnectedUser().structures){
      this.refreshStructures();
    }
    // if( this.navParams.get('data') ) {
    //   this.connectedUser$ = this.navParams.get('data').user;
      
    //   console.log(this.connectedUser$);
      
    //   if (this.connectedUser$.structures){
    //     this.refreshStructures();
    //   }
    // }
  }



  createStructure() : void {
    console.log("In create structure");
    // Create the Structure in the DataBase
    this.structService.addStructure({
      key : 'new_struct',
      users : [
        {
          user_key : this.connectedUser$.key,
          isAdmin : true,
        }
      ],
      name : 'Nouvelle Structure',
      contact : {
        street : 'rue',
        number : 0,
        city : 'ville',
      },
      modules : [
        {
          module_key : 'module_1',
          config_key : 'config_1',
        },
      ]
    });
    //this.refreshStructures();
  }

  private refreshStructures() : void {
    console.log(this.user.getConnectedUser().structures);
    this.structService.getStructureByKey(this.user.getConnectedUser().structures.filter(s => s.isDefault)[0].key).subscribe(data => {
      console.log(data);
      this.defaultStructure$ = data
    }
    );
    
    console.log(this.defaultStructure$);
    
    this.structService.getStructuresByKeys(this.user.getConnectedUser().structures).subscribe(data => 
      this.loadedStructure$ = data);

    this.loadedModules = this.modulesService.getModulesToLoadList(this.defaultStructure$);

    console.log(this.loadedModules);
  }

  goTo(module): void {
    console.log(module);
    console.log(this.defaultStructure$.modules);
    let configKey = this.defaultStructure$.modules.filter(mod =>
      mod.module_key === module.key)[0].config_key;
      console.log(configKey);
    this.navCtrl.setRoot(module.page, {
      data : {
        struct_key : this.structService.getLoadedStructureKey(),
        config_key : configKey,
      }
      // config_key : this.defaultStructure$.modules.filter(mod => mod.module_key === module.key)[0].config_key,
    });
  }

  disconnect() {
    this.navCtrl.setRoot('ConnectPage');
  }

}
