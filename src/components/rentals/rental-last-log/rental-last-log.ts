import { Component, Input } from '@angular/core';
import { Log } from '../../../models/rentals/log.interface';

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

  constructor() {
    console.log('Hello RentalLastLogComponent Component');
  }

}
