/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() dataList: any;
  @Input() selectedData: any;
  @Input() controlName: any;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  selectFilter = new FormControl();
  filteredOptions: Observable<any[]> | undefined;
  constructor() {}

  ngOnInit(): void {
    this.filter();
  }

  filter() {
    this.filteredOptions = this.selectFilter.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.dataList.slice())),
    );
  }

  async returnData(value: any) {
    this.selectedData = value;
    this.selected.emit(this.selectedData);
  }

  clear() {
    if (this.selectedData) {
      this.selectFilter.reset({ _id: '', name: '' });
    }
  }

  displayFn(value: any): string {
    return value && value.name ? value.name : '';
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.dataList.filter((option: any) =>
      option.name.includes(filterValue),
    );
  }
}
