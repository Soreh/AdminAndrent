import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Client } from '../../../models/invoices/client.interface';

/**
 * Generated class for the AddClientModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-client-modal',
  templateUrl: 'add-client-modal.html',
})
export class AddClientModalPage implements OnInit {

  public client: Client;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ngOnInit(){
    if (this.navParams.get('client')) {
      this.client = this.navParams.get('client');
    } else {
      this.client = {}
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClientModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  closeModal() {
    if (this.client) {
      this.viewCtrl.dismiss({
        client: this.client
      })
    }
  }

}
