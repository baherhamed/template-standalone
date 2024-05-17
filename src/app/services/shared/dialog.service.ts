/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  scrollStrategy: ScrollStrategy;
  constructor(
    public dialog: MatDialog,
    private scrollStrategyOptions: ScrollStrategyOptions,
  ) {
    this.scrollStrategy = this.scrollStrategyOptions.noop();
  }

  showAdd(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      position: { top: '5vh', bottom: '25vh' },
      scrollStrategy: this.scrollStrategy,
      disableClose: true,
    });
  }

  showUpdate(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      position: { top: '5vh', bottom: '25vh' },
      scrollStrategy: this.scrollStrategy,
      disableClose: true,
    });
  }

  showSearch(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      position: { top: '5vh', bottom: '25vh' },
      scrollStrategy: this.scrollStrategy,
      disableClose: true,
      ariaModal: true,
    });
  }

  showDetails(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '80vh',
      position: { top: '5vh', bottom: '25vh' },
      scrollStrategy: this.scrollStrategy,
      disableClose: true,
      ariaModal: true,
    });
  }
}
