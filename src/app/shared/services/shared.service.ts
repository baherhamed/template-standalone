import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { site } from '..';
import { GlobalSetting } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  globalSystemSettingUrl = `${environment.url}${site.api}${site.apps.globalSystemSetting}`;
  jsonUrl = `${environment.url}${site.api}${site.apps.json}`;
  constructor(private http: HttpClient) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGlobalSystemSetting(): Observable<any> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: GlobalSetting;
      }>(`${this.globalSystemSettingUrl}${site.appsRoutes.getActive}`, {
        headers: site.requestHeaders().headers,
      })
      .pipe(retry(5));
  }

  setGlobalSystemSetting(
    globalSystemSetting: GlobalSetting,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        message: string;
        data: GlobalSetting;
      }>(
        `${this.globalSystemSettingUrl}${site.appsRoutes.update}`,
        globalSystemSetting,
        {
          headers: site.requestHeaders().headers,
        },
      )
      .pipe(retry(5));
  }

  getTooltipPosition(): Observable<any> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: GlobalSetting;
      }>(`${this.jsonUrl}getTooltipPosition`, {
        headers: site.requestHeaders().headers,
      })
      .pipe(retry(5));
  }
}
