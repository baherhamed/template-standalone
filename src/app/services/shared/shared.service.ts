import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { GlobalSetting } from 'src/app/interfaces';
import { site } from 'src/app/shared';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  generalSystemSettingUrl = `${environment.url}${site.api}${site.apps.generalSystemSetting}`;
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGeneralSystemSetting(): Observable<any> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: GlobalSetting;
      }>(`${this.generalSystemSettingUrl}${site.appsRoutes.getActive}`)
      .pipe(retry(5));
  }

  setGeneralSystemSetting(
    generalSystemSetting: GlobalSetting,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        message: string;
        data: GlobalSetting;
      }>(
        `${this.generalSystemSettingUrl}${site.appsRoutes.update}`,
        generalSystemSetting,
      )
      .pipe(retry(5));
  }

  // updateGov(gov: any): Observable<any> {
  //   return this.http
  //     .put<{
  //       success: boolean;
  //       message: string;
  //       data: Gov;
  //     }>(`${this.govsUrl}${site.appsRoutes.update}`, gov)
  //     .pipe(retry(5));
  // }
}
