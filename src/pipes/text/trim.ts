import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RoundPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'trim',
})
export class TrimTextPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, length: number = 25): string {
    if (value.length > length ){
      return value.slice(0,length-3) + '...';
    } else {
      return value;
    }
  }
}