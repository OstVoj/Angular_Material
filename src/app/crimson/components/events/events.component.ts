import { Event } from './../../services/model/event';
import { EventsDataSource } from './../../services/dataSource/eventsDataSource';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSort, MatPaginator, MatSortable } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { Filter } from '../../classes/filter';
import { ViewService } from '../../services/view.service';

import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})

export class EventsComponent implements OnInit, AfterViewInit {
  public teacherId: Number;
  public dataSource: EventsDataSource;
  public event: Event;
  public displayedColumns = [
    // 'TeachersEvents__id',
    'TeachersEvents__catalog_id',
    'CatalogMaster__catalogname',
    'CatalogMaster__catalogtype',
    'CatalogMaster__startdate',
    'CatalogMaster__enddate',
    'CatalogMaster__city',
    'CatalogMaster__country',
    // 'View',
  ];
  public eventsCount = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private _configService: ConfigService,
    private _viewService: ViewService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.teacherId = Number(this.route.snapshot.paramMap.get('teacherId'));
    this.sort.sort(<MatSortable>({id: 'CatalogMaster__startdate', start: 'desc'}));
    this.event = this.route.snapshot.data['event'];
    this.dataSource = new EventsDataSource(this._viewService);
    const teacherId = this.teacherId ? this.teacherId : this._configService.get('teacher_id');
    this.dataSource.loadEvents(teacherId, 1, 10, 0, this.sort.active, this.sort.direction, null);

    const search = this.input.nativeElement.value;
    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('TeachersEvents__teacher_id', '=', teacherId));
    filters.push(new Filter('search', '=', search));
    this._viewService.get('V_TeacherEvents', filters).subscribe(eventList => {
      this.eventsCount = eventList.length;
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

          this.loadEvents();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      tap(() => this.loadEvents())
    )
    .subscribe();
  }

  loadEvents() {
    const teacherId = this._configService.get('teacher_id');
    const search = this.input.nativeElement.value;

    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('TeachersEvents__teacher_id', '=', teacherId));
    filters.push(new Filter('search', '=', search));
    this._viewService.get('V_TeacherEvents', filters).subscribe(eventList => {
      this.eventsCount = eventList.length;
    }, error => error);

    this.dataSource.loadEvents(
      teacherId,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      0,
      this.sort.active,
      this.sort.direction,
      search
    );
  }

  gotoEvent(eventId) {
    this.router.navigate(['/students', eventId]);
  }

  onChangePage(e) {
  }
}
