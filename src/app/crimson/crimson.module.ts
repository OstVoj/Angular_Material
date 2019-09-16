import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSaverModule } from 'ngx-filesaver';
import { EventsComponent } from './components/events/events.component';
import { LicensesComponent } from './components/licenses/licenses.component';
import { LoginComponent } from './components/login/login.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatSortModule,
  MatSelectModule,
  MatOptionModule,
  MatAutocompleteModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './components/students/students.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ManageComponent } from './components/manage/manage.component';

const routes: Routes  = [
  {
    path     : 'events',
    component: EventsComponent,
  },
  {
    path     : 'events/:teacherId',
    component: EventsComponent,
  },
  {
    path     : 'licenses',
    component: LicensesComponent,
  },
  {
    path     : 'manage',
    component: ManageComponent,
  },
  {
    path     : 'login',
    component: LoginComponent,
  },
  {
    path     : 'students/:catalogId',
    component: StudentsComponent,
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    EventsComponent,
    LicensesComponent,
    NotificationsComponent,
    StudentsComponent,
    LoadingComponent,
    ManageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSortModule,
    MatToolbarModule,
    MatTableModule,
    FileSaverModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule
  ],
  exports: [
    NotificationsComponent,

    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule
  ],
  entryComponents: [
    NotificationsComponent
]
})

export class CrimsonModule { }
