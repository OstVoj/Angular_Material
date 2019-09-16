import { AppComponent } from './app.component';
import { AuthenticationService } from './crimson/services/authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigService } from './crimson/services/config.service';
import { CrimsonModule } from './crimson/crimson.module';
import { ErrorService } from './crimson/services/error.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NotificationsService } from './crimson/components/notifications/notifications.service';
import { ODataService } from './crimson/services/odata.service';
import { RouterModule, Routes } from '@angular/router';
import { TableService } from './crimson/services/table.service';
import { ViewService } from './crimson/services/view.service';

const appRoutes: Routes = [];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CrimsonModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    AuthenticationService,
    ConfigService,
    ErrorService,
    NotificationsService,
    ODataService,
    TableService,
    ViewService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
