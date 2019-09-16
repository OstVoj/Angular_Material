import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Student } from '../model/student';
import { ViewService} from '../view.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {catchError, finalize, filter} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Filter } from '../../classes/filter';

export class StudentsDataSource implements DataSource<Student> {

    private studentsSubject = new BehaviorSubject<Student[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private viewService: ViewService) {
    }

    loadStudents(
      catalogId: number,
      pageIndex: number,
      pageSize: number,
      limit: number,
      orderBy: string,
      direction: string,
      search: string
    ) {
      const filters: Array<Filter> = new Array<Filter>();
      filters.push(new Filter('CatalogMaster__catalog_id', '=', catalogId));
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

      this.viewService.get('Shaumbra_ShaumbraEvents_Catalog', filters).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(students => this.studentsSubject.next(students));
    }

    connect(collectionViewer: CollectionViewer): Observable<Student[]> {
        console.log('Connecting data source');
        return this.studentsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.studentsSubject.complete();
        this.loadingSubject.complete();
    }

}
