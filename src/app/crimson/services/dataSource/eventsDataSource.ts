import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Event } from '../model/event';
import { ViewService} from '../view.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {catchError, finalize, filter} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Filter } from '../../classes/filter';

export class EventsDataSource implements DataSource<Event> {

    private eventsSubject = new BehaviorSubject<Event[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private viewService: ViewService) {
    }

    loadEvents(
      teacherId: number,
      pageIndex: number,
      pageSize: number,
      limit: number,
      orderBy: string,
      direction: string,
      search: string
    ) {
      const filters: Array<Filter> = new Array<Filter>();
      filters.push(new Filter('TeachersEvents__teacher_id', '=', teacherId));
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

      this.viewService.get('V_TeacherEvents', filters).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(events => this.eventsSubject.next(events));

    }

    connect(collectionViewer: CollectionViewer): Observable<Event[]> {
        console.log('Connecting data source');
        return this.eventsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.eventsSubject.complete();
        this.loadingSubject.complete();
    }

}
