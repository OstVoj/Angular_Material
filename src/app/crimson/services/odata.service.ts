import { Alert } from '../classes/alert.class';
import { AlertType } from '../enums/alert-type.enum';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { Filter } from '../classes/filter';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
import { NotificationsService } from '../components/notifications/notifications.service';

@Injectable()
export class ODataService {
    constructor(
        private _httpClient: HttpClient,
        private _configService: ConfigService,
        private _errorService: ErrorService,
        private _notificationsService: NotificationsService,
    ) { }

    public get(endpoint: string, filters: Array<Filter>, applyToken?: boolean): Observable<any> {
        let url  = `${this._configService.get('fullApiUrl')}${endpoint}`;

        if (filters.length > 0) {
            url += '?$filter='

            filters.forEach(filter => {
                url += filter.toODataString();
            });
        }

        let httpHeaders = new HttpHeaders();
        if (applyToken == undefined || applyToken) {
            httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + this._configService.get('access_token'));
        }

        let options = { headers: httpHeaders };

        return this._httpClient.get(url, options).pipe(
            map(data => {
                return data;
            }),
            catchError(error => {
                this._notificationsService.add(new Alert(AlertType.Error, this._errorService.getErrorMessage(error)));
                return empty();
            })
        );
    }

}
