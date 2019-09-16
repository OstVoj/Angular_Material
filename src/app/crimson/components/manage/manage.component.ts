import { Shaumbra } from './../../services/model/shaumbra';
import { TableService } from './../../services/table.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSort, MatPaginator, MatSortable } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Filter } from '../../classes/filter';

import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router } from '@angular/router';
import { ShaumbrasDataSource } from '../../services/dataSource/shaumbrasDataSource';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})

export class ManageComponent implements OnInit, AfterViewInit {
  public dataSource: ShaumbrasDataSource;
  public shaumbra: Shaumbra;
  public displayedColumns = [
    'shaumbra_id',
    'firstname',
    'lastname',
    'email',
    'city',
    'state',
    'zip',
    'country',
    'phone',
    'isTeacher'
  ];
  public shaumbrasCount = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private _tableService: TableService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.sort.sort(<MatSortable>({id: 'firstname', start: 'asc'}));
    this.shaumbra = this.route.snapshot.data['shaumbra'];
    this.dataSource = new ShaumbrasDataSource(this._tableService);
    this.dataSource.loadShaumbras(1, 10, 0, this.sort.active, this.sort.direction, null);

    const search = this.input.nativeElement.value;
    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('search', '=', search));
    this._tableService.get('Shaumbra_', filters).subscribe(shaumbraList => {
      this.shaumbrasCount = shaumbraList.length;
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

          this.loadShaumbras();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      tap(() => this.loadShaumbras())
    )
    .subscribe();
  }

  loadShaumbras() {
    const search = this.input.nativeElement.value;

    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('search', '=', search));
    this._tableService.get('Shaumbra_', filters).subscribe(shaumbraList => {
      this.shaumbrasCount = shaumbraList.length;
    }, error => error);

    this.dataSource.loadShaumbras(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      0,
      this.sort.active,
      this.sort.direction,
      search
    );
  }

  removeTeacher(shaumbraId) {
    this._tableService.delete('Teachers_', {'shaumbra_id': shaumbraId}).subscribe(result => {
      this.loadShaumbras();
    });
  }

  addTeacher(shaumbraId, email) {
    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('1', '=', 1));
    filters.push(new Filter('select', '=', 'Max(teacher_id)'));
    this._tableService.get('Teachers_', filters).subscribe(result => {
      const teacherId = result[0].Column1 + 1;
      this._tableService.post('Teachers_', {
        'teacher_id': teacherId,
        'shaumbra_id': shaumbraId,
        email,
      }).subscribe(res => {
        this.loadShaumbras();
      });
    });
  }
}
