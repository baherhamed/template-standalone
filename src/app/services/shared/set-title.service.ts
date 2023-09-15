import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SetTitleService {
  constructor(public titleService: Title) {}

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }
  getTitle() {
    this.titleService.getTitle();
  }
}
