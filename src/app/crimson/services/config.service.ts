import { environment } from '../../../environments/environment';
import { ErrorService } from './error.service';
import { Injectable } from '@angular/core';
import { KeyValuePair } from '../classes/key-value-pair.class';

@Injectable()
export class ConfigService {

    private _appConfigs: KeyValuePair[];
    private _userConfigs: KeyValuePair[];

    get appConfigs() {
        return this._appConfigs;
    }
    set appConfigs(value: KeyValuePair[]) {
        this._appConfigs = value;
    }

    constructor(
        private _errorService: ErrorService,
    ) {
        this.appConfigs = new Array<KeyValuePair>();
        this.appConfigs.push(new KeyValuePair('apiUrl', environment.apiUrl));
        this.appConfigs.push(new KeyValuePair('apiUrlVersion', 'api/v1.0/'));
        this.appConfigs.push(new KeyValuePair('fullApiUrl', this.get('apiUrl') + this.get('apiUrlVersion')));
        this.appConfigs.push(new KeyValuePair('clientId', 'crimson_webclient'));
        this.appConfigs.push(new KeyValuePair('clientSecret', 'q2mz3SdpWVioNQL'));
    }

    get(key: string): any {

        const appConfigs = this.appConfigs.filter(function(appConfig) {
            return appConfig.key === key;
        });

        return appConfigs.length > 0 ? appConfigs[0].value : '';
    }

    remove(key: string, collection: KeyValuePair[] = this.appConfigs): void {

        this.appConfigs = this.appConfigs.filter(appConfig => appConfig.key !== key);

    }

}
