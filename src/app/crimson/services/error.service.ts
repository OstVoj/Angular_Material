import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {

    constructor () {}

    public getErrorMessage(error): string {

        let returnValue = '';

        if (error.hasOwnProperty('error')) {
            returnValue = this.getErrorMessage(error.error);
        }

        if (error instanceof Array) {

            error.forEach(translation => {

                if (translation.hasOwnProperty('key') && translation.key === 'en') {
                    returnValue += translation.value;
                }

            });
        }

        if (error.hasOwnProperty('additional') && error.addition != null) {
            returnValue += ' ' + error.additional;
        }

        return returnValue;
    }

}
