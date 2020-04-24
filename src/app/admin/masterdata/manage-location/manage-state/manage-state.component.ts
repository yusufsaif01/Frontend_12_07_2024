import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ManageStateTableConfig } from './manage-state-table-conf';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '@app/admin/service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { StateService } from './manage-state-service';
@Component({
  selector: 'app-manage-state',
  templateUrl: './manage-state.component.html',
  styleUrls: ['./manage-state.component.scss']
})
export class ManageStateComponent implements OnInit {
  // table config
  public tableConfig: ManageStateTableConfig = new ManageStateTableConfig();
  public dataSource = new MatTableDataSource([]);
  addStateForm: FormGroup;
  country_id: string;
  editMode: boolean = false;
  stateId: any;
  row: any = {};
  update: any = '';

  // sidebar
  public sideBarToggle: boolean = true;
  updateSidebar($event: any) {
    this.sideBarToggle = $event;
  }
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private service: StateService
  ) {
    this.createForm();
    this.route.params.subscribe(params => {
      this.country_id = params['id'];
    });
  }
  ngOnInit() {
    this.getStateListByCountry(this.country_id);
  }
  addState() {
    this.adminService
      .addState({ ...this.addStateForm.value, country_id: this.country_id })
      .subscribe(
        response => {
          console.log('server response', response);
          this.toastrService.success(
            `${response.message}`,
            'State Added Successfully'
          );
          this.addStateForm.reset();
          this.getStateListByCountry(this.country_id);
        },
        error => {
          console.log('error', error);
          this.toastrService.error(`${error.error.message}`, 'Error');
        }
      );
  }
  getStateListByCountry(country_id: string) {
    this.adminService.getStateListByCountry({ country_id }).subscribe(
      response => {
        console.log('response', response);
        let records = response.data.records;
        for (let i = 0; i < records.length; i++) {
          records[i]['serialNumber'] = i + 1;
        }
        this.dataSource = new MatTableDataSource(records);
      },
      error => {
        console.log('error', error);
      }
    );
  }

  createForm() {
    this.addStateForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]]
    });
  }
  editState(name: any, id: any) {
    let obj = { name, id };
    this.row = obj;
    console.log(obj);
    this.editMode = true;
    this.stateId = id;
    this.getStateListByCountry(this.country_id);
  }
  updateState(name: any, id: any) {
    console.log('NAME N ID', name, id);
    if (!name || name == '') {
      return;
    }
    this.editMode = false;
    this.update = 'update';
    setTimeout(() => {
      this.update = '';
    }, 1000);
  }
  cancelState(user: any) {
    console.log(user);
    this.editMode = false;
    this.update = 'cancel';
    this.getStateListByCountry(this.country_id);
  }
  onChange(event: any) {
    console.log(event);
    if (event.id) {
      console.log('UPDATE');
      this.updateStateByCountry(event);
    }
  }
  updateStateByCountry(body: any) {
    let state_id = body.id;
    delete body['id'];
    delete body['serialNumber'];
    this.service.updateState(state_id, this.country_id, body).subscribe(
      data => {
        console.log('Update', data);
        this.toastrService.success(
          `${data.message}`,
          'State Updated Successfully'
        );
        this.getStateListByCountry(this.country_id);
      },
      error => {
        console.log(error);
        this.toastrService.error(`${error.error.message}`, 'Error');
        this.getStateListByCountry(this.country_id);
      }
    );
  }
}