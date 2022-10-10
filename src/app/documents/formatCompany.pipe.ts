import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
    name: 'formatCompany'
})
export class FormatCompanyPipe implements PipeTransform {
    transform(value: string) {

        const code = value.toString().split(" ")[0];

        return code;
       
    }
}
 