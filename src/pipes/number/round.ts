import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RoundPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'round_percent',
})
export class RoundPercentPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args): string {
    if (value > 0 ){
      return Math.round(value) + "%";
    } else {
      return "0%";
    }
  }
}
