import { Student } from './../../services/model/student';
import { MatSort, MatPaginator } from '@angular/material';
import { ConfigService } from './../../services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewService } from '../../services/view.service';
import { Filter } from '../../classes/filter';
import { FileSaverService } from 'ngx-filesaver';

import { Location } from '@angular/common';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { StudentsDataSource } from '../../services/dataSource/studentsDataSource';
export interface ShaumbraElement {
  Shaumbra__shaumbra_id: number;
  Name: string;
  // Shaumbra__firstname: string;
  // Shaumbra__lastname: string;
  Email: string;
  Date: string;
  // Shaumbra__address1: string;
  // Shaumbra__address2: string;
  Shaumbra__city: string;
  Shaumbra__state: string;
  Shaumbra__zip: string;
  Shaumbra__country: string;
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})

export class StudentsComponent implements OnInit, AfterViewInit {

  public catalogId = 0;

  public dataSource: StudentsDataSource;
  public student: Student;
  public studentsCount = 0;
  public displayedColumns = [
    'Shaumbra__shaumbra_id',
    'Name',
    // 'Shaumbra__firstname',
    // 'Shaumbra__lastname',
    'Email',
    'Date',
    // 'Shaumbra__address1',
    // 'Shaumbra__address2',
    'Shaumbra__city',
    'Shaumbra__state',
    'Shaumbra__zip',
    'Shaumbra__country',
    'View'
  ];
  public loading = false;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _FileSaverService: FileSaverService,
    private _configService: ConfigService,
    private _viewService: ViewService,
    private _location: Location
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  ngOnInit() {
    this.catalogId = Number(this.route.snapshot.paramMap.get('catalogId'));
    this.student = this.route.snapshot.data['student'];
    this.dataSource = new StudentsDataSource(this._viewService);
    this.dataSource.loadStudents(this.catalogId, 1, 10, 0, this.sort.active, this.sort.direction, null);

    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('CatalogMaster__catalog_id', '=', this.catalogId));

    this._viewService.get('Shaumbra_ShaumbraEvents_Catalog', filters).subscribe(students => {
      this.studentsCount = students.length;
    }, error => error);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadStudents();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      tap(() => this.loadStudents())
    )
    .subscribe();
  }

  loadStudents() {
    const search = this.input.nativeElement.value;

    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('CatalogMaster__catalog_id', '=', this.catalogId));
    filters.push(new Filter('search', '=', search));
    this._viewService.get('Shaumbra_ShaumbraEvents_Catalog', filters).subscribe(eventList => {
      this.studentsCount = eventList.length;
    }, error => error);

    this.dataSource.loadStudents(
      this.catalogId,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      0,
      this.sort.active,
      this.sort.direction,
      this.input.nativeElement.value
    );
  }

  public onDownload(id = 0): void {
    const teacherId = this._configService.get('teacher_id');
    const url  = `${this._configService.get('fullApiUrl')}pdf?id=${this.catalogId}&teacherId=${teacherId}&shaumbraId=${id}`;

    this._http.get(url, {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this._configService.get('access_token') }),
      observe: 'response',
      responseType: 'blob',
    }).subscribe(res => {
      const fileName = id === 0 ? `${teacherId}-${this.catalogId}.pdf` : `${teacherId}-${this.catalogId}-${id}.pdf`;
      this._FileSaverService.save((<any>res).body, fileName);
    });
  }

  public onDownloadSignInSheet(): void {
    const teacherId = this._configService.get('teacher_id');
    const url  = `${this._configService.get('fullApiUrl')}pdf/getSignInSheet?id=${this.catalogId}&teacherId=${teacherId}`;

    this._http.get(url, {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this._configService.get('access_token') }),
      observe: 'response',
      responseType: 'blob',
    }).subscribe(res => {
      const fileName = `${teacherId}-${this.catalogId}.pdf`;
      this._FileSaverService.save((<any>res).body, fileName);
    });
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  backClicked() {
    this._location.back();
  }
}
