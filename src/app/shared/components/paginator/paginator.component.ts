/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnChanges,  Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Pagination, ResponsePaginationData } from '../..';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges {
  @Input('paginationData') paginationData: ResponsePaginationData | any;
  @Output('pageChange') pageChange = new EventEmitter<Pagination>();

  totalDocs: number = 0;

  length: number = 0;
  pageSize: number = 0;
  pageIndex: number = 0;

  pageSizeOptions = [1, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;
  async ngOnChanges() {
    this.length = this.paginationData?.totalDocs || 0;
    this.totalDocs = this.paginationData?.totalDocs || 0;
    this.pageSize = this.paginationData?.limit || 0;
    this.pageIndex = this.paginationData?.page - 1 ;
  }

  handlePageEvent(e: PageEvent) {
    ++e.pageIndex;
    const newValues = {
      page: e.pageIndex,
      limit: e.pageSize
    };
    this.pageChange.emit(newValues);
  }
}
