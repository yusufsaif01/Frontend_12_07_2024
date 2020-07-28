import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ViewEditProfileService } from '../view-edit-profile.service';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from '@app/core';
import { SharedService } from '@app/shared/shared.service';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { environment } from '@env/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HeaderComponent } from '@app/shared/page-components/header/header.component';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
  MAT_DATE_FORMATS
} from '@angular/material';
import { DateConversion } from '@app/shared/utilities/date-conversion';

let pincodeControl = {
  pincode: [Validators.required, Validators.pattern(/^\d+$/)]
};
let addressControl = {
  address: [Validators.required]
};

const APP_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    dateInput: { year: 'numeric' }
  }
};

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DateConversion
  ]
})
export class PersonalDetailsComponent implements OnInit {
  @Input() clubAcademyType = '';
  member_type: string = localStorage.getItem('member_type') || 'player';
  currentYear = new Date().getFullYear();
  tomorrow = new Date();
  today = new Date();
  countryArray: any[] = [];
  stateArray: any[] = [];
  cityArray: any[] = [];
  profile: any = {};
  personalProfileDetailsForm: FormGroup;
  profile_status: string;
  editMode: boolean = false;
  player_type: string = 'grassroot';
  @ViewChild(HeaderComponent, { static: true }) header: HeaderComponent;
  constructor(
    private _editProfileService: ViewEditProfileService,
    private _sharedService: SharedService,
    private _toastrService: ToastrService,
    private _formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private _dateConversion: DateConversion
  ) {
    this.createForm();
    this.manageCommonControls();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  ngOnInit() {
    this.getLocationStats();
    this.getPersonalProfileDetails();
  }

  transformURL(url: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  appendURL(url: string): SafeHtml {
    if (url.includes('http')) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return this._sanitizer.bypassSecurityTrustResourceUrl(`https://${url}`);
  }
  toggleMode() {
    this.editMode = !this.editMode;
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

  checkRequiredValidator(
    form: FormGroup,
    controlObject: { [name: string]: ValidatorFn[] },
    require: boolean
  ) {
    const [name] = Object.keys(controlObject);
    let controlName = form.get(name);
    let validationArray = controlObject[name];

    if (require) {
      validationArray = [
        ...new Set([...controlObject[name], Validators.required])
      ];
    } else {
      validationArray = validationArray.filter(
        validator => validator !== Validators.required
      );
    }

    controlName.setValidators(validationArray);
    controlName.updateValueAndValidity();
  }

  setCategoryValidators() {
    if (['club', 'academy'].includes(this.member_type)) {
      if (this.member_type === 'club') {
        this.checkRequiredValidator(
          this.personalProfileDetailsForm,
          { pincode: pincodeControl.pincode },
          false
        );
      }

      if (this.member_type === 'academy') {
        this.setControlValidation(
          this.personalProfileDetailsForm,
          addressControl
        );
        this.setControlValidation(
          this.personalProfileDetailsForm,
          pincodeControl
        );
      }
    }
  }

  createForm() {
    this.personalProfileDetailsForm = this._formBuilder.group({});
    if (this.member_type === 'player') {
      this.personalProfileDetailsForm = this._formBuilder.group({
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email]
        ],
        phone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^\d+$/)
          ]
        ],
        gender: ['', Validators.required],
        first_name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/)
          ]
        ],
        last_name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/)
          ]
        ],
        dob: ['', [Validators.required]], //2020-04-14T18:30:00.000Z"
        height_feet: [
          '',
          [
            Validators.required,
            Validators.min(1),
            Validators.max(10),
            Validators.pattern(/^\d+$/)
          ]
        ],
        height_inches: [
          '',
          [
            Validators.required,
            Validators.min(0),
            Validators.max(12),
            Validators.pattern(/^\d+$/)
          ]
        ],
        weight: [
          '',
          [
            Validators.min(1),
            Validators.max(200),
            Validators.pattern(/^\d+(\.\d)?$/)
          ]
        ],
        school: ['', []],
        university: [''],
        college: ['']
      });
    } else {
      this.personalProfileDetailsForm = this._formBuilder.group({
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email]
        ]
      });
    }
  }

  closeDatePicker(
    elem: MatDatepicker<any>,
    event: MatDatepickerInputEvent<Date>,
    controlName: string
  ) {
    elem.close();
    let year = new Date(String(event));
    this.personalProfileDetailsForm.get(controlName).setValue(year);
  }
  uploadAvatar(files: FileList) {
    const requestData = new FormData();
    requestData.set('avatar', files[0]);
    this._editProfileService
      .updateAvatar(requestData)
      .pipe(untilDestroyed(this))
      .subscribe(
        res => {
          if (res.data.avatar_url) {
            this.profile.avatar_url =
              environment.mediaUrl + res.data.avatar_url;
          }
          localStorage.setItem(
            'avatar_url',
            environment.mediaUrl + res.data.avatar_url
          );
          this.header.avatar_url = localStorage.getItem('avatar_url');
          this._toastrService.success('Success', 'Avatar updated successfully');
        },
        err => {
          this._toastrService.error('Error', err.error.message);
        }
      );
  }
  getPersonalProfileDetails() {
    this._editProfileService
      .getPersonalProfileDetails()
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          // this._toastrService.success(
          //   'Successful',
          //   'Data retrieved successfully'
          // );
          this.profile = response.data;
          this.profile_status = this.profile.profile_status.status;
          this.player_type = this.profile.player_type;
          if (this.profile.avatar_url) {
            this.profile.avatar_url =
              environment.mediaUrl + this.profile.avatar_url;
          } else {
            this.profile.avatar_url =
              environment.mediaUrl + '/uploads/avatar/user-avatar.png';
          }
          this.populateFormFields(this.profile);
          this.setCategoryValidators();
        },
        error => {
          this._toastrService.error(error.error.message, 'Error');
        }
      );
  }
  populateFormFields(profileData: any) {
    this.personalProfileDetailsForm.valueChanges.subscribe(val => {
      this.player_type = val.player_type;
    });
    this.personalProfileDetailsForm.patchValue(profileData);
    if (this.profile.country) {
      this.getStatesListing(this.profile.country.id);
      this.getCitiesListing(this.profile.country.id, this.profile.state.id);
    }

    this.personalProfileDetailsForm.patchValue({
      state: this.profile.state ? this.profile.state.id : '',
      city: this.profile.city ? this.profile.city.id : '',
      country: this.profile.country ? this.profile.country.id : '',
      height_feet:
        this.profile.height && this.profile.height.feet
          ? this.profile.height.feet
          : '',
      height_inches:
        this.profile.height && this.profile.height.inches
          ? this.profile.height.inches
          : '',
      school:
        this.profile.institute && this.profile.institute.school
          ? this.profile.institute.school
          : '',
      university:
        this.profile.institute && this.profile.institute.university
          ? this.profile.institute.university
          : '',
      college:
        this.profile.institute && this.profile.institute.college
          ? this.profile.institute.college
          : '',
      youtube:
        this.profile.social_profiles && this.profile.social_profiles.youtube
          ? this.profile.social_profiles.youtube
          : '',
      facebook:
        this.profile.social_profiles && this.profile.social_profiles.facebook
          ? this.profile.social_profiles.facebook
          : '',
      twitter:
        this.profile.social_profiles && this.profile.social_profiles.twitter
          ? this.profile.social_profiles.twitter
          : '',
      instagram:
        this.profile.social_profiles && this.profile.social_profiles.instagram
          ? this.profile.social_profiles.instagram
          : '',
      linked_in:
        this.profile.social_profiles && this.profile.social_profiles.linked_in
          ? this.profile.social_profiles.linked_in
          : '',
      founded_in: this.profile.founded_in
        ? new Date(this.profile.founded_in)
        : '',
      address:
        this.profile.address && this.profile.address.full_address
          ? this.profile.address.full_address
          : '',
      pincode:
        this.profile.address && this.profile.address.pincode
          ? this.profile.address.pincode
          : ''
    });
    if (
      this.member_type === 'player' &&
      this.profile.profile_status.status === 'verified'
    ) {
      this.personalProfileDetailsForm.controls.dob.disable();
    }
  }
  formControlAdder(
    form: FormGroup,
    controls: { name: string; abstractControl: AbstractControl }[]
  ) {
    controls.forEach(control => {
      form.addControl(control.name, control.abstractControl);
    });
  }
  manageCommonControls() {
    let commonControls = [
      {
        name: 'country',
        abstractControl: this._formBuilder.control('', [Validators.required])
      },
      {
        name: 'state',
        abstractControl: this._formBuilder.control('', [Validators.required])
      },
      {
        name: 'city',
        abstractControl: this._formBuilder.control('', [Validators.required])
      },
      {
        name: 'facebook',
        abstractControl: this._formBuilder.control('')
      },
      {
        name: 'twitter',
        abstractControl: this._formBuilder.control('')
      },
      {
        name: 'instagram',
        abstractControl: this._formBuilder.control('')
      },
      {
        name: 'youtube',
        abstractControl: this._formBuilder.control('')
      },
      {
        name: 'linked_in',
        abstractControl: this._formBuilder.control('')
      },
      {
        name: 'bio',
        abstractControl: this._formBuilder.control('', [
          Validators.maxLength(350)
        ])
      }
    ];
    this.formControlAdder(this.personalProfileDetailsForm, commonControls);
    if (['academy', 'club'].includes(this.member_type)) {
      let clubAcadCommonControls = [
        {
          name: 'name',
          abstractControl: this._formBuilder.control('', [
            Validators.required,
            Validators.pattern(/^(?:[0-9]+[ a-zA-Z]|[a-zA-Z])[a-zA-Z0-9 ]*$/)
          ])
        },
        {
          name: 'short_name',
          abstractControl: this._formBuilder.control('', [])
        },
        {
          name: 'founded_in',
          abstractControl: this._formBuilder.control('', [
            Validators.required
            // Validators.minLength(4),
            // Validators.maxLength(4),
            // Validators.max(this.currentYear),
            // Validators.pattern(/^\d+$/)
          ])
        },
        {
          name: 'phone',
          abstractControl: this._formBuilder.control('', [
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^\d+$/)
          ])
        },
        {
          name: 'mobile_number',
          abstractControl: this._formBuilder.control('', [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/^\d+$/)
          ])
        },
        {
          name: 'address',
          abstractControl: this._formBuilder.control('')
        },
        {
          name: 'pincode',
          abstractControl: this._formBuilder.control('')
        },
        {
          name: 'stadium_name',
          abstractControl: this._formBuilder.control('')
        }
      ];
      this.formControlAdder(
        this.personalProfileDetailsForm,
        clubAcadCommonControls
      );
    }
  }
  getLocationStats() {
    this._sharedService
      .getLocationStats()
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.countryArray = response.data;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  getStatesListing(countryID: string) {
    this._sharedService
      .getStatesListing(countryID)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.stateArray = response.data.records;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  getCitiesListing(countryID: string, stateID: string) {
    this._sharedService
      .getCitiesListing(countryID, stateID)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response: any) => {
          this.cityArray = response.data.records;
        },
        error => {
          this._toastrService.error('Error', error.error.message);
        }
      );
  }

  onSelectCountry(event: any) {
    if (!event.target.value) {
      this.resetStateCity();
    } else {
      this.getStatesListing(event.target.value);
    }
  }

  resetStateCity() {
    this.stateArray = [];
    this.cityArray = [];
    this.personalProfileDetailsForm.controls.state.patchValue('');
    this.personalProfileDetailsForm.controls.city.patchValue('');
  }

  onSelectState(event: any) {
    if (!event.target.value) {
      this.resetCity();
    } else {
      this.getCitiesListing(
        this.personalProfileDetailsForm.controls.country.value,
        event.target.value
      );
    }
  }
  resetCity() {
    this.cityArray = [];
    this.personalProfileDetailsForm.controls.city.patchValue('');
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

  updatePersonalProfileDetails() {
    let requestData = this.toFormData(this.personalProfileDetailsForm.value);

    if (this.profile_status === 'verified') requestData.delete('dob');
    if (this.member_type !== 'player') {
      this.dateModifier(requestData);
    }
    this._editProfileService
      .updatePersonalProfileDetails(requestData)
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this._toastrService.success(
            'Success',
            'Profile updated successfully'
          );
          this.getPersonalProfileDetails();
          this.toggleMode();
        },
        error => {
          this._toastrService.error(error.error.message, 'Error');
        }
      );
  }

  dateModifier(requestData: any) {
    let years = ['founded_in'];
    years.map(data => {
      requestData.set(
        data,
        this._dateConversion.convertToYear(
          this.personalProfileDetailsForm.get(data).value
        )
      );
    });
  }

  ngOnDestroy() {}
}
