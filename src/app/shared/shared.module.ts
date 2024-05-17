import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import {
  FilterComponent,
  MessageComponent,
  PaginatorComponent,
  RecordDetailsComponent,
  SpinnerComponent,
} from '.';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    PaginatorComponent,
    SpinnerComponent,
    RecordDetailsComponent,
    MessageComponent,
    FilterComponent,
  ],
  imports: [
    MaterialModule,
    TranslateModule,
    CommonModule,
    ToastrModule,
    RouterLink,
    RouterLinkActive,
  ],
  exports: [
    PaginatorComponent,
    SpinnerComponent,
    RecordDetailsComponent,
    MessageComponent,
    FilterComponent,
    MaterialModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule,

    ToastrModule,
  ],
})
export class SharedModule {}
