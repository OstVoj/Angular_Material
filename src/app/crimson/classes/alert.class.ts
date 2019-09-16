import { AlertType } from "../enums/alert-type.enum";

export class Alert {

    private _timestamp: number;
    private _alertType: AlertType;
    private _message: string;

    get timestamp(): number {
        return this._timestamp;
    }
    set timestamp(value: number){
        this._timestamp = value;
    }

    get alertType(): AlertType {
        return this._alertType;
    }
    set alertType(value: AlertType){
        this._alertType = value;
    }

    get message(): string {
        return this._message;
    }
    set message(value: string) {
        this._message = value;
    }

    constructor(alertType: AlertType, message: string) {

        this._alertType = alertType;
        this._message = message;
        this.timestamp = Date.now();
        
    }
}