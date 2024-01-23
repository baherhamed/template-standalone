/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { Login } from 'src/app/interfaces';

import { site } from 'src/app/shared';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  securityUrl = `${environment.url}${site.api}${site.modules.security}`;
  usersUrl = `${environment.url}${site.api}${site.modules.security}${site.apps.users}`;

  constructor(private http: HttpClient) {}

  login(login: Login): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        message: string;
        data: Login;
      }>(`${this.securityUrl}${site.apps.login}`, login)
      .pipe(retry(5));
  }
}
