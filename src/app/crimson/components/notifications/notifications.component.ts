import { Alert } from '../../classes/alert.class';
import { AlertType } from '../../enums/alert-type.enum';
import { Component, Inject, OnInit } from '@angular/core';
import { NotificationsService } from "../notifications/notifications.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    public _notificationsService: NotificationsService
  ) { }

  ngOnInit() {
  }

  getClass(alert: Alert) {

    if (alert.alertType == AlertType.Error)
      return "alert-error";
    else if (alert.alertType == AlertType.Success)
      return "alert-success";
    else if (alert.alertType == AlertType.Warning)
      return "alert-warning";

  }

  delete(index: number) {

    this._notificationsService.delete(index);

  }

}
