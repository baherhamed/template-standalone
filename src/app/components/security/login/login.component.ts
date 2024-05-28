/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Login } from 'src/app/interfaces';
import { SecurityService } from 'src/app/services';
import { HandleResponseService, IResponse, getTokenValue, inputsLength, site } from 'src/app/shared';

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
    private handleResponse: HandleResponseService,
  ) {
    this.inputsLength = inputsLength;
  }

  tryLogin(login: Login) {
    try {
      this.busy = true;
      this.securityService.login(login).subscribe(async (res: IResponse) => {
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }

        localStorage.setItem(site.token, response.data.token);
        localStorage.setItem(site.routesList, response.data.routesList);
        localStorage.setItem(site.permissionsList, response.data.permissionsList);
        localStorage.setItem(site.currentLangValue, response.data.language);
        localStorage.setItem(site.globalSetting, response.data.globalSetting);
        const tokenValues = await getTokenValue();
        this.userLoggedIn = tokenValues?.userLoggedIn;
        location.assign('/');
      })
    } catch (error) {
      alert(error);
    };
  }
}
