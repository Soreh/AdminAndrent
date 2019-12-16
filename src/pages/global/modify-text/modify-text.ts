import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModifyTextPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modify-text',
  templateUrl: 'modify-text.html',
})
export class ModifyTextPage {

  public text: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewWillEnter() {
    if (this.navParams.get('text')) {
      this.text = this.navParams.get('text');
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModifyTextPage');
  }

  close() {
    this.viewCtrl.dismiss({
      update: false
    });
  }

  modify() {
    this.viewCtrl.dismiss({
      update: true,
      text: this.text
    });
  }

}
