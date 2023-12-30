/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Login } from 'src/app/interfaces';
import { NotificationService, SecurityService } from 'src/app/services';
import {
  IResponse,
  getTokenValue,
  inputsLength,
  site,
  validateResponse,
} from 'src/app/shared';

import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule, CommonModule],
})
export class LoginComponent {
  userLoggedIn?: boolean = false;
  userType: string | undefined;
  site: any;
  inputsLength: any;

  busy = false;
  login: Login = {
    username: '',
    password: '',
  };

  constructor(
    private securityService: SecurityService,
    private notification: NotificationService,
  ) {
    this.inputsLength = inputsLength;
  }

  tryLogin(login: Login) {
    this.busy = true;
    this.securityService.login(login).subscribe(async (res: IResponse) => {
      const response = await validateResponse(res);

      if (!response.success || !response.data) {
        return this.notification.info(response.message);
      }
      try {
        this.notification.success(response.message);
        localStorage.setItem(site.token, res.data.token);
        localStorage.setItem(site.routesList, res.data.routesList);
        localStorage.setItem(site.permissionsList, res.data.permissionsList);
        localStorage.setItem(site.currentLangValue, res.data.language);
        const tokenValues = await getTokenValue();
        this.userLoggedIn = tokenValues?.userLoggedIn;
        location.assign('/');
      } catch (error) {
        alert(error);
      }

      this.busy = false;
    });
  }
}
