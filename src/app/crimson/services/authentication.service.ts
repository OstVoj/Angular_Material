import { Alert } from '../classes/alert.class';
import { AlertType } from '../enums/alert-type.enum';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { KeyValuePair } from '../classes/key-value-pair.class';
import { NotificationsService } from '../components/notifications/notifications.service';

@Injectable()
export class AuthenticationService {

    private sessionStart: EventEmitter<any> = new EventEmitter();
    private sessionEnd: EventEmitter<any> = new EventEmitter();

    private refreshTokenManagement = {
        expiresIn: 0,
        timerId: null,
    };

    constructor(
        private _configService: ConfigService,
        private _errorService: ErrorService,
        private _httpClient: HttpClient,
        private _notificationService: NotificationsService,
    ) { }

    public getToken(body: any): void {
        const url = `${this._configService.get('apiUrl')}oauth/token`;
        const options = { headers: new HttpHeaders() };

        const httpParams = new HttpParams()
            .set('grantType', 'password')
            .set('email', body.email)
            .set('password', body.password)
            .set('clientId', this._configService.get('clientId'))
            .set('clientSecret', this._configService.get('clientSecret'));

        this._configService.remove('email');
        this._configService.appConfigs.push(new KeyValuePair('email', body.email));

        this._httpClient.post(url, httpParams, options).subscribe(data => {
            this._configService.remove('access_token');
            this._configService.remove('access_token_expires');
            this._configService.remove('refresh_token');
            this._configService.remove('refresh_token_expires');
            this._configService.remove('teacher_id');
            this._configService.remove('shaumbra_id');
            this._configService.remove('is_admin');

            this._configService.appConfigs.push(new KeyValuePair('access_token', data['accessToken']));
            this._configService.appConfigs.push(new KeyValuePair('access_token_expires', data['accessTokenExpiresAt']));
            this._configService.appConfigs.push(new KeyValuePair('refresh_token', data['refreshToken']));
            this._configService.appConfigs.push(new KeyValuePair('refresh_token_expires', data['refreshTokenExpiresAt']));
            this._configService.appConfigs.push(new KeyValuePair('teacher_id', data['userId']));
            this._configService.appConfigs.push(new KeyValuePair('shaumbra_id', data['shaumbraId']));
            this._configService.appConfigs.push(new KeyValuePair('is_admin', data['isAdmin']));

            /*
            this.refreshTokenManagement.expiresIn = data["expires_in"] * 500;
            this.refreshTokenManagement.timerId = setInterval(() => this.refreshToken(), this.refreshTokenManagement.expiresIn);
            */
            this.sessionStart.emit(null);

            return data;
        },
        error => {
            this._notificationService.add(new Alert(AlertType.Error, this._errorService.getErrorMessage(error)));
        });
    }

    private refreshToken(): void {
        const url = `${this._configService.get('apiUrl')}token`;
        const options = {headers: new HttpHeaders()};

        const httpParams = new HttpParams()
            .set('grantType', 'refresh_token')
            .set('refreshToken', this._configService.get('refresh_token'))
            .set('clientId', this._configService.get('clientId'))
            .set('clientSecret', this._configService.get('clientSecret'));

        this._httpClient.post(url, httpParams, options).subscribe(data => {
            this._configService.remove('access_token');
            this._configService.remove('access_token_expires');
            this._configService.remove('refresh_token');
            this._configService.remove('refresh_token_expires');

            this._configService.appConfigs.push(new KeyValuePair('access_token', data['accessToken']));
            this._configService.appConfigs.push(new KeyValuePair('access_token_expires', data['accessTokenExpiresAt']));
            this._configService.appConfigs.push(new KeyValuePair('refresh_token', data['refreshToken']));
            this._configService.appConfigs.push(new KeyValuePair('refresh_token_expires', data['refreshTokenExpiresAt']));

            /*
            this.refreshTokenManagement.expiresIn = data["expires_in"] * 500;
            */
            return data;
        },
        error => {
            this._notificationService.add(new Alert(AlertType.Error, this._errorService.getErrorMessage(error)));
        });
    }

    public clearToken(): void {

        // Stop refreshing the token.
        clearInterval(this.refreshTokenManagement.timerId);

        // Clear the user's configuration.
        this._configService.remove('access_token');
        this._configService.remove('access_token_expires');
        this._configService.remove('refresh_token');
        this._configService.remove('refresh_token_expires');
        this._configService.remove('teacher_id');
        this._configService.remove('shaumbra_id');

        // Fire the event.
        this.sessionEnd.emit(null);
    }

    /*
    public passwordReset(email: string): Observable<any> {

        let url  = `${this._configService.get("fullApiUrl")}Account/requestadminpasswordreset?adminemail=${email}`;
        let headers = new HttpHeaders().set('api', '');
        let options = {headers: headers};

        return this._httpClient.get(url, options)
            .do(data => {
                return data;
            })
            .catch(error => {
                return Observable.throw(error);
            });
    }

    public resetPassword(body): Observable<any> {

        let url  = `${this._configService.get("fullApiUrl")}Account/resetadminpassword`;
        let headers = new HttpHeaders().set('api', '');
        let options = { headers: headers };

        return this._httpClient.post(url, body, options)
            .do(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.log(error);
                return Observable.throw(error);
            });
    }
    */

    public onSessionStart() {
        return this.sessionStart;
    }

    public onSessionEnd() {
        return this.sessionEnd;
    }

}
