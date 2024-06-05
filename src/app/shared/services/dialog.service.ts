/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { site } from '..';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {
    //  private scrollStrategyOptions: ScrollStrategyOptions,
  }

  showDialog(type: string, templateRef?: any) {
    if (type === site.dialogNames.add) {
      this.add(templateRef);
    }
    if (type === site.dialogNames.update) {
      this.update(templateRef);
    }
    if (type === site.dialogNames.search) {
      this.search(templateRef);
    }
    if (type === site.dialogNames.details) {
      this.details(templateRef);
    }
    if (type === site.dialogNames.showMessage) {
      this.showMessage(templateRef);
    }

  }
  add(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      position: { top: '5vh', bottom: '25vh' },
      disableClose: true,
    });
  }

  update(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      position: { top: '5vh', bottom: '25vh' },
      disableClose: true,
    });
  }

  search(templateRef?: any) {
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

  details(templateRef?: any) {
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

  showMessage(templateRef?: any) {
    this.dialog.open(templateRef, {
      autoFocus: true,
      width: '50vw',
      maxWidth: '50vw',
      maxHeight: '50vh',
      position: { top: '5vh', bottom: '25vh' },
      disableClose: true,
      ariaModal: true,
    });
  }
}
