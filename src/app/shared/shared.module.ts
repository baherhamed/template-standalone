import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { PaginatorComponent, SpinnerComponent } from '.';
// import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PaginatorComponent, SpinnerComponent],
  imports: [
    MaterialModule,
    // RouterLink,
    // RouterLinkActive,
    TranslateModule,
    CommonModule,
    ToastrModule,
  ],
  exports: [
    PaginatorComponent,
    SpinnerComponent,
    MaterialModule,
    // RouterLink,
    // RouterLinkActive,
    TranslateModule,

    ToastrModule,
  ],
})
export class SharedModule {}
