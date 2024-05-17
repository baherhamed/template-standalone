/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, HostListener } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { site } from './shared';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { NavModule } from './nav/nav.module';
import {
  CitiesComponent,
  GovsComponent,
  LoginComponent,
  RoutesComponent,
  UsersComponent,
  GlobalSettingComponent
} from './components';
import { DialogService, NotificationService } from './services';

// import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    TranslateModule,
    NavModule,
    TranslateModule,
    CommonModule,
    LoginComponent,
    UsersComponent,
    RoutesComponent,
    GovsComponent,
    CitiesComponent,
    GlobalSettingComponent,
    RouterOutlet,
    // ToastrModule,
  ],
  providers: [DialogService,  NotificationService],
})
export class AppComponent {
  site: any;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F12') {
      event.preventDefault();
    }
  }

  constructor(private translateService: TranslateService) {
    this.setLanguage();
  }

  async ngOnInit() {
    // site = site;
    // this.site.disableDeveloperTools();
  }

  setLanguage() {
    const currentLanguage = localStorage.getItem(site.currentLangValue);

    const htmlTag = document.querySelector('html');
    let setLang = '';
    if (!currentLanguage || currentLanguage === site.language.ar) {
      if (htmlTag) {
        htmlTag.setAttribute('dir', 'rtl');
        setLang = site.language.ar;
      }
    } else if (currentLanguage && currentLanguage === site.language.en) {
      if (htmlTag) {
        htmlTag.setAttribute('dir', 'ltr');
        setLang = site.language.en;
      }
    }
    this.translateService.setDefaultLang(setLang);
  }
}
