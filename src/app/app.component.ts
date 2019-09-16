import { ViewService } from './crimson/services/view.service';
import { AuthenticationService } from './crimson/services/authentication.service';
import { Component } from '@angular/core';
import { ConfigService } from './crimson/services/config.service';
import { Router } from '@angular/router';
import { TableService } from './crimson/services/table.service';
import { Filter } from './crimson/classes/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isFullPage = true;
  public title = 'Crimson Circle Teachers';
  public name = '';
  public isAdmin = false;
  public teacher;
  public teachers;

  constructor(
    private _authenticationService: AuthenticationService,
    private _configService: ConfigService,
    private _router: Router,
    private _tableService: TableService,
    private _viewService: ViewService
  ) {
    // Display login on load.
    this._router.navigate(['/login']);

    // Handle Login
    this._authenticationService.onSessionStart().subscribe(() => {
      this.isFullPage = false;
      const shaumbraId = this._configService.get('shaumbra_id');

      const filters: Array<Filter> = new Array<Filter>();
      filters.push(new Filter('shaumbra_id', '=', shaumbraId));

      // Retrieve the Teacher's Shaumbra profile.
      this._tableService.get('Shaumbra_', filters).subscribe(shaumbra => {
        this.name = `${shaumbra[0].firstname} ${shaumbra[0].lastname}`;
          // this._profileService.userData = data[0];

      }, error => error);

      const isAdmin = this._configService.get('is_admin');
      this.isAdmin = isAdmin;
      if (isAdmin) {
        const teacherNamesFilters: Array<Filter> = new Array<Filter>();
        teacherNamesFilters.push(new Filter('limit', '=', 1000));
        teacherNamesFilters.push(new Filter('orderBy', '=', 'Shaumbra__full_name ASC'));
        this._viewService.get('View_teacher_names', teacherNamesFilters).subscribe(teachers => {
          this.teachers = teachers;
          const teachersFilter = teachers.filter(teacher => teacher.Teachers__shaumbra_id === shaumbraId);
          this.teacher = teachersFilter[0].Teachers__shaumbra_id;
        });
      }

      this._router.navigate(['/events']);
    });
  }

  onSelectTeacher(shaumbraId) {
    const filters: Array<Filter> = new Array<Filter>();
    filters.push(new Filter('shaumbra_id', '=', shaumbraId));
    this._tableService.get('Teachers_', filters).subscribe(teacher => {
      this._router.navigate(['/events', teacher[0].teacher_id]);
    }, error => error);
  }
}
