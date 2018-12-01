import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { UserProfile } from "../../models/global/user-profile.interface";
import { ModulesProvider } from '../../providers/global/modules/modules';
import { StructureServiceProvider } from '../../providers/global/structure-service/structure-service';
import { Structure } from '../../models/global/structure.interface';
import { UserServiceProvider } from '../../providers/global/user-service/user-service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'firebase';

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
  
  public modules;
  public structures$;
  public structure$;
  public structure;
  public structKeyToLink;
  //public loadedStructures;

  private authenticatedUSer$ : Subscription;
  public authUser : User;

  public profileExists : boolean;
  private userProfile$ : Subscription;
  public userProfile : UserProfile;
  public otherStructures : any;

  public showAddStruct: boolean;
  public loading = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private modulesService: ModulesProvider, 
    private structService : StructureServiceProvider,
    private user : UserServiceProvider,
    private modalCtrl: ModalController) {
      this.userProfile = this.user.getConnectedUser();
      console.debug(this.userProfile);
      // this.authenticatedUSer$ = this.user.getAuthUser().subscribe( 
      //   (authUser : User) => {
      //     this.authUser = authUser;
      //     if ( authUser.uid ) {
      //       this.userProfile$ = this.user.getProfile(authUser.uid).subscribe(
      //         (profile : UserProfile) => {
      //           console.log(profile);
      //           if (profile) {
      //             this.profileExists = true;
      //             console.log(profile);
      //             if(profile.structures){
      //               this.structure$ = this.structService.getDefaultStructure(profile).subscribe(
      //                 (struct : Structure) => {
      //                   this.structure = struct;
      //                   this.modules = this.modulesService.getModulesToLoadList(struct);
      //                 }
      //               );
      //             }
      //             this.userProfile = profile;
      //           } 
      //         }
      //       );
      //     }
      //     this.loading = false;
      //     console.log(this.userProfile);
      //   }
      // );
  }

  ionViewWillLoad() {
    console.log('ionViewDidLoad StartPage');
    if(!this.userProfile){
      console.error('No user connected');
      this.navCtrl.setRoot('ConnectPage');
    } else {
      console.debug(this.userProfile);
    }
  }

  async createProfileAndShowAddStruct() {
    // Creer le compte utilisateur en DB !
    if (this.authUser ) {
      await this.user.saveProfile(this.authUser.uid, this.userProfile).then((fulfilled) => {
        console.log(fulfilled);
        this.showAddForm();
      }, (error) => {
        console.error(error);
      }
      );
    }
    // Afficher le formulaire pour ajotuer une structure
    //this.showAddStruct = true;
  }
  
  showAddForm(){
    this.showAddStruct = true;
  }

 async createProfileAndLinkStructure() {
    console.warn('Il faut vérifier la présence de la structure en base données');
    this.userProfile.structures = [
      {
        key : this.structKeyToLink,
        isDefault : true,
      }
    ]
    console.warn(this.structKeyToLink);
    console.warn(this.authUser);
    console.warn(this.userProfile);
    
    if (this.authUser){
      const result = await this.user.saveProfile(this.authUser.uid, this.userProfile);
      console.log(result);
    }
  }

  createStructure(isDefault: boolean = false) : void {
    console.log("In create structure");
    // Create the Structure in the DataBase
    this.structService.addStructure({
      key : 'new_struct',
      users : [
        {
          user_key : this.userProfile.key,
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
    }, isDefault);
    this.navCtrl.setRoot('StartPage');
  }

  private _refreshStructures() : void {
    //console.log(this.user.getConnectedUser().structures);
    //this.structure$ = this.structService.getDefaultStructure();
    console.log(this.structure$);
    this.structures$ = this.structService.getStructures();

    // this.structService.getStructuresByKeys(this.user.getConnectedUser().structures).subscribe(data => 
    //   this.loadedStructure$ = data);

    this.modules = this.modulesService.getModulesToLoadList(this.structure$);

    console.log(this.modules);
  }

  goTo(module): void {
    console.log(module);
    console.log(this.structure$.modules);
    let configKey = this.structure$.modules.filter(mod =>
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

  openAddStructureModal(){
    let modal = this.modalCtrl.create('AddStructureModalPage');
    modal.present();
  }

  goToConfig() : void {
    this.navCtrl.push('ConfigPage');
  }

}
