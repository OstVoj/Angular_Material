import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public formErrors: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

    this.formErrors = {
      email: {},
      password: {},
    };

    this.form = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      this.onValuesChange();
    });

  }

  public onSubmit(): void {

    const email = this.form.get('email').value;
    const password = this.form.get('password').value;
    this._authenticationService.getToken({ email, password });

  }

  public onValuesChange(): void {
    for (const field in this.formErrors) {

      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }

      this.formErrors[field] = {};
      const control = this.form.get(field);

      if (control && !control.valid) {
          this.formErrors[field] = control.errors;
      }
    }
  }

}
