import { Injectable } from '@angular/core';
import { Alert } from '../../classes/alert.class';
import { AlertType } from '../../enums/alert-type.enum';

@Injectable()
export class NotificationsService {

  private _alerts: Alert[] = [];

  get alerts(): Alert[] {
    return this._alerts;
  }

  constructor() {}

  public add(alert: Alert) {

    this._alerts.push(alert);

  }

  public delete(index: number) {
    this._alerts.splice(index, 1);
  }

}
