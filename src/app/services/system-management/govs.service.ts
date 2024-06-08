/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { Gov } from 'src/app/interfaces';

import { site } from 'src/app/shared';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GovsService {
  govsUrl = `${environment.url}${site.api}${site.apps.govs}`;

  constructor(private http: HttpClient) {}

  addGov(gov: Gov): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        statusCode: number;
        message: string;
        data: Gov;
      }>(`${this.govsUrl}${site.appsRoutes.add}`, gov,
        {
          headers: site.requestHeaders().headers,
        })
      .pipe(retry(5));
  }

  updateGov(gov: any): Observable<any> {
    return this.http
      .put<{
        success: boolean;
        statusCode: number;
        message: string;
        data: Gov;
      }>(`${this.govsUrl}${site.appsRoutes.update}`, gov,
        {
          headers: site.requestHeaders().headers,
        })
      .pipe(retry(5));
  }

  deleteGov(gov: any): Observable<any> {
    return this.http
      .put<{
        success: boolean;
        statusCode: number;
        message: string;
        data: any;
      }>(`${this.govsUrl}${site.appsRoutes.delete}`, gov,
        {
          headers: site.requestHeaders().headers,
        })
      .pipe(retry(5));
  }

  searchGov(gov: any): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        statusCode: number;
        message: string;
        data: Gov[];
      }>(`${this.govsUrl}${site.appsRoutes.search}`, gov,
        {
          headers: site.requestHeaders().headers,
        })
      .pipe(retry(5));
  }

  getAllGovs(pagination?: any): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        statusCode: number;
        message: string;
        data: Gov[];
      }>(`${this.govsUrl}${site.appsRoutes.getAll}`, pagination,
        {
          headers: site.requestHeaders().headers,
        })
      .pipe(retry(5));
  }

  getActiveGovs() {
    return this.http
      .post<{
        success: boolean;
        statusCode: number;
        message: string;
        data: Gov[];
      }>(`${this.govsUrl}${site.appsRoutes.getActive}`, null,
        {
          headers: site.requestHeaders().headers,
        })
      .pipe(retry(5));
  }

  viewGov<Observable>(gov: any) {
    return this.http
      .post<{
        success: boolean;
        statusCode: number;
        message: string;
        data: Gov;
      }>(`${this.govsUrl}${site.appsRoutes.view}`, gov,
        {
          headers: site.requestHeaders().headers,
        })
      .pipe(retry(5));
  }
}
