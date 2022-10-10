import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
    name: 'ratings'
})
export class RatingsPipe implements PipeTransform {
    transform(value: string) {

        let ratings = value.split('-');
        let cleanArray = ratings.filter(function (el) {
            return el != "";
          });
        return cleanArray;
    }
}
 