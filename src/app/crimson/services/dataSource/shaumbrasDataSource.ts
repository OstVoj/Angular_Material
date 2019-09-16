import { TableService } from './../table.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {catchError, finalize, filter} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Filter } from '../../classes/filter';
import { Shaumbra } from '../model/shaumbra';

export class ShaumbrasDataSource implements DataSource<Shaumbra> {

    private shaumbrasSubject = new BehaviorSubject<Shaumbra[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private tableService: TableService) {
    }

    loadShaumbras(
      pageIndex: number,
      pageSize: number,
      limit: number,
      orderBy: string,
      direction: string,
      search: string
    ) {
      const filters: Array<Filter> = new Array<Filter>();
      filters.push(new Filter('1', '=', 1));
      filters.push(new Filter('limit', '=', limit));
      filters.push(new Filter('pageSize', '=', pageSize));
      filters.push(new Filter('pageNumber', '=', pageIndex));
      if (orderBy) {
        filters.push(new Filter('orderBy', '=', `${orderBy} ${direction}`));
      }
      if (search) {
        filters.push(new Filter('search', '=', search));
      }
      this.loadingSubject.next(true);

      this.tableService.get('Shaumbra_', filters).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(shaumbras => {
        shaumbras.map(shaumbra => {
          const teacherFilters: Array<Filter> = new Array<Filter>();
          teacherFilters.push(new Filter('shaumbra_id', '=', shaumbra.shaumbra_id));
          this.tableService.get('Teachers_', teacherFilters).subscribe(teachers => {
            if (teachers.length > 0) {
              shaumbra.isTeacher = true;
            }
            // const value = this.shaumbrasSubject.getValue();
            // this.shaumbrasSubject.next(value.concat([shaumbra]));
          });
        });
        this.shaumbrasSubject.next(shaumbras);
      });

    }

    connect(collectionViewer: CollectionViewer): Observable<Shaumbra[]> {
        console.log('Connecting data source');
        return this.shaumbrasSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.shaumbrasSubject.complete();
        this.loadingSubject.complete();
    }

}
