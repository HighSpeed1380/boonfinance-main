import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
    name: 'sentimentPercent'
})
export class SentimentPercentPipe implements PipeTransform {
    transform(value: number) {

        const val = Math.abs(value).toFixed(2);

        return Math.trunc(Math.abs(value * 100))
       
    }
}
 