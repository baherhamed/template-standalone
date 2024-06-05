import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent, MenuComponent } from '.';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MenuComponent, FooterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [MenuComponent, FooterComponent],
})
export class LayoutModule {}
