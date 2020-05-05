import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { matchingPassword } from '@app/shared/validators/matchingPassword';

@Component({
  selector: 'app-reset-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {
  createPasswordForm: FormGroup;
  token: string;
  isLinkExpired: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastrService: ToastrService
  ) {
    this.createForm();
    this._route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  ngOnInit() {
    this._authenticationService.emailVerification(this.token).subscribe(
      response => {
        if (response.status === 'success') {
          this.isLinkExpired = true;
          this._toastrService.success(
            'Successful',
            'Email verified successfully'
          );
        }
      },
      error => {
        // if (error.error.code === 'LINK_EXPIRED' || error.error.code === 'INVALID_TOKEN')
        this._router.navigate(['/link-expired']);
      }
    );
  }

  createPassword() {
    this._authenticationService
      .createPassword(this.createPasswordForm.value, this.token)
      .subscribe(
        response => {
          this._toastrService.success('Successful', 'Password Creation');
          this._router.navigate(['/login']);
        },
        error => {
          this._toastrService.error('Failed', 'Password Creation');
        }
      );
  }

  createForm() {
    this.createPasswordForm = this._formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\\\|\:\;\'\"\,\.\<\>\/\?])/
            )
          ]
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\\\|\:\;\'\"\,\.\<\>\/\?])/
            )
          ]
        ]
      },
      {
        validator: matchingPassword
      }
    );
  }
}
