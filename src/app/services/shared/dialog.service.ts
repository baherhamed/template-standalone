/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {
    //  private scrollStrategyOptions: ScrollStrategyOptions,
  }

  showAdd(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      position: { top: '5vh', bottom: '25vh' },
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
      disableClose: true,
      ariaModal: true,
    });
  }
}
