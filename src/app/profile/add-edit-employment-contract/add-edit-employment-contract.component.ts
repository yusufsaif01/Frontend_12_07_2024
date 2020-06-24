import { Component, OnInit, OnDestroy } from '@angular/core';
import { PanelOptions } from '@app/shared/models/panel-options.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { AddEditEmploymentContractService } from './add-edit-employment-contract.service';
import { untilDestroyed } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

interface clubAcadArrayContext {
  name: string;
  email: string;
  address: string;
  mobile: string;
  aiffNumber: string;
}

@Component({
  selector: 'app-add-edit-employment-contract',
  templateUrl: './add-edit-employment-contract.component.html',
  styleUrls: ['./add-edit-employment-contract.component.scss']
})
export class AddEditEmploymentContractComponent implements OnInit, OnDestroy {
  panelOptions: Partial<PanelOptions> = {
    player_type: false,
    logout_link: true,
    achievements: true,
    footplayers: true,
    is_public: false
  };

  profile: any;
  addEditContractForm: FormGroup;
  tomorrow = new Date();
  yesterday = new Date();
  category = 'club';
  clubAcadArray: clubAcadArrayContext[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _employmentContractService: AddEditEmploymentContractService,
    private _toastrService: ToastrService,
    private _router: Router
  ) {
    this.createForm();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }
  ngOnDestroy() {}

  ngOnInit() {
    this.setValidators();
  }

  getClubAcademyList() {
    this._employmentContractService
      .getClubAcademyList({ role: this.category })
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this.clubAcadArray = response.data;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  setControlValidation(
    form: FormGroup,
    controlObject: { [name: string]: ValidatorFn[] }
  ) {
    for (const name in controlObject) {
      let controlName = form.get(name);
      controlName.setValidators(controlObject[name]);
      controlName.updateValueAndValidity();
    }
  }

  checkRequiredValidator(controlname: any, paramname: any, type: number) {
    if (type === 1)
      paramname.includes(Validators.required)
        ? controlname
        : paramname.push(Validators.required);
    else if (type === 2)
      paramname.includes(Validators.required)
        ? paramname.splice(paramname.findIndex(Validators.required), 1)
        : controlname;
  }

  setValidators() {
    const clubAcademyName = this.addEditContractForm.get('clubAcademyName');
    const otherName = this.addEditContractForm.get('otherName');
    const otherEmail = this.addEditContractForm.get('otherEmail');
    const otherPhoneNumber = this.addEditContractForm.get('otherPhoneNumber');
    const clubAcademyUsesAgentServices = this.addEditContractForm.get(
      'clubAcademyUsesAgentServices'
    );
    const clubAcademyIntermediaryName = this.addEditContractForm.get(
      'clubAcademyIntermediaryName'
    );
    const clubAcademyTransferFee = this.addEditContractForm.get(
      'clubAcademyTransferFee'
    );
    const playerUsesAgentServices = this.addEditContractForm.get(
      'playerUsesAgentServices'
    );
    const playerIntermediaryName = this.addEditContractForm.get(
      'playerIntermediaryName'
    );
    const playerTransferFee = this.addEditContractForm.get('playerTransferFee');

    const clubAcademyPhoneNumber = this.addEditContractForm.get(
      'clubAcademyPhoneNumber'
    );

    let otherControl: { [name: string]: ValidatorFn[] } = {
      otherName: [Validators.required],
      otherEmail: [Validators.required, Validators.email],
      otherPhoneNumber: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]
    };

    let clubAcademyPhoneNumberControl = {
      clubAcademyPhoneNumber: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)
      ]
    };

    this.setControlValidation(this.addEditContractForm, otherControl);
    clubAcademyName.valueChanges.subscribe(value => {
      if (value === 'Other') {
        otherName.setValue('');
        otherEmail.setValue('');
        otherPhoneNumber.setValue('');
        clubAcademyPhoneNumber.setValue('');

        this.checkRequiredValidator(otherControl, otherControl.otherName, 1);
        this.checkRequiredValidator(otherControl, otherControl.otherEmail, 1);
        this.checkRequiredValidator(
          otherControl,
          otherControl.otherPhoneNumber,
          1
        );
        this.setControlValidation(this.addEditContractForm, otherControl);

        this.checkRequiredValidator(
          clubAcademyPhoneNumberControl,
          clubAcademyPhoneNumberControl.clubAcademyPhoneNumber,
          2
        );
        this.setControlValidation(
          this.addEditContractForm,
          clubAcademyPhoneNumberControl
        );

        otherPhoneNumber.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(value => {
            if (value) {
              this.checkRequiredValidator(
                otherControl,
                otherControl.otherEmail,
                2
              );
            } else {
              this.checkRequiredValidator(
                otherControl,
                otherControl.otherEmail,
                1
              );
            }
            this.setControlValidation(this.addEditContractForm, otherControl);
          });

        otherEmail.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(value => {
            if (value) {
              this.checkRequiredValidator(
                otherControl,
                otherControl.otherPhoneNumber,
                2
              );
            } else {
              this.checkRequiredValidator(
                otherControl,
                otherControl.otherPhoneNumber,
                1
              );
            }
            this.setControlValidation(this.addEditContractForm, otherControl);
          });
      } else {
        otherName.setValue('');
        otherEmail.setValue('');
        otherPhoneNumber.setValue('');
        clubAcademyPhoneNumber.setValue('');
        this.checkRequiredValidator(otherControl, otherControl.otherName, 2);
        this.checkRequiredValidator(otherControl, otherControl.otherEmail, 2);
        this.checkRequiredValidator(
          otherControl,
          otherControl.otherPhoneNumber,
          2
        );
        this.setControlValidation(this.addEditContractForm, otherControl);

        this.checkRequiredValidator(
          clubAcademyPhoneNumberControl,
          clubAcademyPhoneNumberControl.clubAcademyPhoneNumber,
          1
        );
        this.setControlValidation(
          this.addEditContractForm,
          clubAcademyPhoneNumberControl
        );
      }
    });

    let clubAcademyServiceControl = {
      clubAcademyIntermediaryName: [Validators.required],
      clubAcademyTransferFee: [Validators.required]
    };

    clubAcademyUsesAgentServices.valueChanges.subscribe(value => {
      if (value === 'true') {
        this.checkRequiredValidator(
          clubAcademyServiceControl,
          clubAcademyServiceControl.clubAcademyIntermediaryName,
          1
        );
        this.checkRequiredValidator(
          clubAcademyServiceControl,
          clubAcademyServiceControl.clubAcademyTransferFee,
          1
        );
      } else if (value === 'false') {
        clubAcademyIntermediaryName.setValue('');
        clubAcademyTransferFee.setValue('');

        this.checkRequiredValidator(
          clubAcademyServiceControl,
          clubAcademyServiceControl.clubAcademyIntermediaryName,
          2
        );
        this.checkRequiredValidator(
          clubAcademyServiceControl,
          clubAcademyServiceControl.clubAcademyTransferFee,
          2
        );
      }
      this.setControlValidation(
        this.addEditContractForm,
        clubAcademyServiceControl
      );
    });

    let playerServiceControl = {
      playerIntermediaryName: [Validators.required],
      playerTransferFee: [Validators.required]
    };

    playerUsesAgentServices.valueChanges.subscribe(value => {
      if (value === 'true') {
        this.checkRequiredValidator(
          playerServiceControl,
          playerServiceControl.playerIntermediaryName,
          1
        );
        this.checkRequiredValidator(
          playerServiceControl,
          playerServiceControl.playerTransferFee,
          1
        );
      } else if (value === 'false') {
        playerIntermediaryName.setValue('');
        playerTransferFee.setValue('');

        this.checkRequiredValidator(
          playerServiceControl,
          playerServiceControl.playerIntermediaryName,
          2
        );
        this.checkRequiredValidator(
          playerServiceControl,
          playerServiceControl.playerTransferFee,
          2
        );
      }
      this.setControlValidation(this.addEditContractForm, playerServiceControl);
    });
  }

  setCategory(value: string) {
    this.category = value;
    this.getClubAcademyList();
  }

  toFormData<T>(formValue: T) {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];

      if (!value && !value.length && key != 'bio') {
        continue;
      }
      formData.append(key, value);
    }
    return formData;
  }

  setRequestDataObject(requestData: any, name: string) {
    return requestData.set(
      name,
      JSON.stringify(this.addEditContractForm.get(name).value)
    );
  }

  addContract() {
    let requestData = this.toFormData(this.addEditContractForm.value);
    this._employmentContractService
      .addContract(requestData)
      .pipe(untilDestroyed(this))
      .subscribe(
        res => {
          let { id } = res.data;
          this._toastrService.success(
            'Successful',
            'Profile updated successfully'
          );
          this.addEditContractForm.reset();
          this._router.navigate([
            '/member/profile/view-employment-contract/',
            id
          ]);
        },
        err => {
          this._toastrService.error('Error', err.error.message);
        }
      );
  }

  getProfileData(data: Object) {
    this.profile = data;
    this.populateFormFields();
  }

  populateFormFields() {
    if (this.profile) {
      this.addEditContractForm.patchValue({
        playerMobileNumber: this.profile.phone ? this.profile.phone : '',
        playerEmail: this.profile.email ? this.profile.email : ''
      });
    }
  }

  onSelectOption(c: HTMLSelectElement) {
    let identity = c.selectedOptions[0].attributes['identity'];
    if (!identity) {
      this.addEditContractForm.patchValue({
        clubAcademyAddress: '',
        clubAcademyPhoneNumber: '',
        aiffNumber: '',
        clubAcademyEmail: ''
      });
      return;
    }

    let email = identity.value;
    let selectedClubAcad = this.clubAcadArray.filter(
      value => value.email === email
    );

    let item = selectedClubAcad[0];
    this.addEditContractForm.patchValue({
      clubAcademyAddress: item.address ? item.address : '',
      clubAcademyPhoneNumber: item.mobile ? item.mobile : '',
      aiffNumber: item.aiffNumber ? item.aiffNumber : '',
      clubAcademyEmail: item.email ? item.email : ''
    });
  }

  createForm() {
    this.addEditContractForm = this._formBuilder.group({
      category: ['', [Validators.required]],
      playerName: ['', [Validators.required]],
      clubAcademyName: ['', [Validators.required]],
      otherName: ['', []],
      otherEmail: ['', []],
      otherPhoneNumber: ['', []],
      signingDate: ['', [Validators.required]],
      effectiveDate: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      placeOfSignature: ['', []],
      clubAcademyRepresentativeName: ['', []],
      clubAcademyAddress: ['', []],
      clubAcademyPhoneNumber: ['', []],
      clubAcademyEmail: ['', [Validators.email]],
      aiffNumber: ['', []],
      crsUserName: ['', []],
      legalGuardianName: ['', []],
      playerAddress: ['', []],
      playerMobileNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^\d+$/)
        ]
      ],
      playerEmail: ['', [Validators.email]],

      clubAcademyUsesAgentServices: ['', []],
      clubAcademyIntermediaryName: ['', []],
      clubAcademyTransferFee: ['', []],

      playerUsesAgentServices: ['', []],
      playerIntermediaryName: ['', []],
      playerTransferFee: ['']
    });
  }
}
