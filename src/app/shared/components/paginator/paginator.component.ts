/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  @Input('paginationData') paginationData: any;
  @Output('pageChange') pageChange = new EventEmitter<PageEvent>();

  // constructor() {}
  // pageIndex = 0;
  // pageSize = 0;
  // totalDocs = 0;

  // pageSizeOptions = [5, 10, 20, 50, 100, 200, 300, 500, 1000];
  // showFirstLastButtons = true;

  // async ngOnInit() {
  //   console.log('this.paginationData', this.paginationData);

  //   if (this.paginationData) {
  //     this.totalDocs = this.paginationData.totalDocs;
  //     this.pageSize = this.paginationData.limit;
  //     this.pageIndex = this.paginationData.page -1;
  //   }
  // }

  // handlePageEvent(event: PageEvent) {
  //   console.log('event', event);
  //   // event.pageIndex += 1;
  //   this.pageChange.emit(event);
  // }

  length = 0;
  pageSize = 0;
  pageIndex = 0;
  pageSizeOptions = [ 10, 20, 50, 100, 200, 300, 500, 1000];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;
  async ngOnInit() {
    this.length = this.paginationData?.totalDocs || 0;
    this.pageSize = this.paginationData?.limit || 0;
    this.pageIndex = this.paginationData?.page - 1;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex;
    this.pageIndex = e.pageIndex <= 0 ? --e.pageIndex : ++e.pageIndex;
    this.pageChange.emit(e);
  }

  // setPageSizeOptions(setPageSizeOptionsInput: string) {
  //   if (setPageSizeOptionsInput) {
  //     this.pageSizeOptions = setPageSizeOptionsInput
  //       .split(',')
  //       .map((str) => +str);
  //   }
  // }
}
