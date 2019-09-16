import { Alert } from '../classes/alert.class';
import { AlertType } from '../enums/alert-type.enum';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { Filter } from '../classes/filter';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
import { NotificationsService } from '../components/notifications/notifications.service';

@Injectable()
export class TableService {
    constructor(
        private _httpClient: HttpClient,
        private _configService: ConfigService,
        private _errorService: ErrorService,
        private _notificationsService: NotificationsService,
    ) { }

    public get(table: string, parameters: Array<Filter>): Observable<any> {
        let url  = `${this._configService.get('fullApiUrl')}table?table=${table}`;

        if (parameters.length > 0) {
            parameters.forEach((filter) => {
                url += '&' + filter.toString();
            });
        }
        let httpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + this._configService.get('access_token'));

        const options = { headers: httpHeaders };

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

    public post(table: string, data: any): Observable<any> {
      const url  = `${this._configService.get('fullApiUrl')}table?table=${table}`;
      let httpHeaders = new HttpHeaders();
      httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + this._configService.get('access_token'));
      const options = { headers: httpHeaders };

      return this._httpClient.post(url, data, options).pipe(
        map(result => {
            return result;
        }),
        catchError(error => {
            this._notificationsService.add(new Alert(AlertType.Error, this._errorService.getErrorMessage(error)));
            return empty();
        })
      );
    }

    public delete(table: string, data: any): Observable<any> {
      const url  = `${this._configService.get('fullApiUrl')}table?table=${table}`;
      let httpHeaders = new HttpHeaders();
      httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + this._configService.get('access_token'));
      const options = {
        headers: httpHeaders,
        body: data
      };

      return this._httpClient.delete(url, options).pipe(
        map(result => {
            return result;
        }),
        catchError(error => {
            this._notificationsService.add(new Alert(AlertType.Error, this._errorService.getErrorMessage(error)));
            return empty();
        })
      );
    }

}
