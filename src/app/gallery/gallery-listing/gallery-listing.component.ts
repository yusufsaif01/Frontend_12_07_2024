import { Component, OnInit } from '@angular/core';
import {
  GalleryListingService,
  GetGalleryListResponseContext,
  GetGalleryListContext
} from './gallery-listing.service';
import { untilDestroyed } from '@app/core';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '@app/shared/shared.service';
@Component({
  selector: 'app-gallery-listing',
  templateUrl: './gallery-listing.component.html',
  styleUrls: ['./gallery-listing.component.scss']
})
export class GalleryListingComponent implements OnInit {
  constructor(
    private _sharedService: SharedService,
    private _galleryListingService: GalleryListingService,
    private _toastrService: ToastrService
  ) {}

  filter: GetGalleryListContext = {};
  galleryList: GetGalleryListContext[] = [];
  pageSize = 10;
  pageNo = 1;
  selectedPage = 1;
  show_count = 0;
  total_count = 0;
  searchText = '';
  isPublic = false;
  member_type: string = localStorage.getItem('member_type');
  video_type: string = 'timeline';
  // filtersList = {
  //   position: false,
  //   playerCategory: false,
  //   age: false,
  //   location: false,
  //   strongFoot: false,
  //   teamTypes: false,
  //   ability: false,
  //   status: false,
  //   phyiscal: true,
  //   mental: true,
  //   technical: true,
  //   goalkeeping: true,
  //   otherability: true
  // };

  filtersList = {};

  ngOnInit() {
    this.filter.page_size = this.pageSize;
    this.filter.page_no = this.pageNo;
    this.getGalleryList();
  }

  toggleVideoType(type: string) {
    this.video_type = type;
    this.getGalleryList();
  }

  openFilter() {
    this._sharedService.setFilterDisplayValue(true);
  }

  updatePage(event: any) {
    this.selectedPage = event.selectedPage;
    this.pageNo = this.selectedPage;
    this.filter.page_no = this.pageNo;
    this.getGalleryList();
  }

  getSearchText(value: string) {
    this.searchText = value;
    this.filter.search = this.searchText;
    this.filter.page_no = 1;
    this.selectedPage = 1;
    this.getGalleryList();
  }

  onChangeFilter(event: any) {
    if (event) {
      this.filter = event;
    } else {
      this.filter = {};
    }
    this.selectedPage = 1;
    this.filter.page_no = 1;
    this.filter.page_size = 10;
    this.getGalleryList();
  }

  getGalleryList() {
    this._galleryListingService
      .getGalleryList({ type: this.video_type, ...this.filter })
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this.galleryList = response.data.records;
          this.show_count = response.data.records.length;
          this.total_count = response.data.total;
        },
        error => {
          this._toastrService.error(error.error.message, 'Error');
        }
      );
  }

  replaceFilterProperty(searchProp: string, replaceProp: string) {
    if (this.filter.hasOwnProperty(searchProp)) {
      Object.defineProperty(
        this.filter,
        replaceProp,
        Object.getOwnPropertyDescriptor(this.filter, searchProp)
      );
      delete this.filter[searchProp];
    }
  }

  attachEnvironmentUrl(value: String) {
    return environment.mediaUrl + value;
  }

  ngOnDestroy() {}
}