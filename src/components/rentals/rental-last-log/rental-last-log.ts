import { Component, Input, Output } from '@angular/core';
import { Log } from '../../../models/rentals/log.interface';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the RentalLastLogComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rental-last-log',
  templateUrl: 'rental-last-log.html'
})
export class RentalLastLogComponent {

  @Input() lastLog : Log;
  @Input() logs    : Log[];

  constructor(private modalCtrl: ModalController) {
    console.log('Hello RentalLastLogComponent Component');
  }

  openModifyTextModal(textToModify: string, index) {
    let modal = this.modalCtrl.create('ModifyTextPage', {
      text: textToModify
    });

    modal.onDidDismiss( (data) => {
      if (data.update) {
        this.logs[index].msg = data.text;
      }
    });

    modal.present();
  }

}
