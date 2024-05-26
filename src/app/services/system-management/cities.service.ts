/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { City } from 'src/app/interfaces';
import { site } from 'src/app/shared';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  // citiesUrl = `${environment.url}${site.api}${site.modules.systemManagement}${site.apps.cities}`;
  citiesUrl = `${environment.url}${site.api}${site.apps.cities}`;

  constructor(private http: HttpClient) {}

  addCity(city: any): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        message: string;
        data: City;
      }>(`${this.citiesUrl}${site.appsRoutes.add}`, city, {
        headers: site.requestHeaders().headers,
      })
      .pipe(retry(5));
  }

  updateCity(city: any): Observable<any> {
    return this.http
      .put<{ success: boolean; message: string; data: City }>(
        `${this.citiesUrl}${site.appsRoutes.update}`,
        city,
        {
          headers: site.requestHeaders().headers,
        },
      )
      .pipe(retry(5));
  }

  deleteCity(city: any): Observable<any> {
    return this.http
      .put<{ success: boolean; message: string; data: City }>(
        `${this.citiesUrl}${site.appsRoutes.delete}`,
        city,
        {
          headers: site.requestHeaders().headers,
        },
      )
      .pipe(retry(5));
  }

  searchCity(city: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City[] }>(
        `${this.citiesUrl}${site.appsRoutes.search}`,
        city,
        {
          headers: site.requestHeaders().headers,
        },
      )
      .pipe(retry(5));
  }

  getCitiesByGov(city: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City[] }>(
        `${this.citiesUrl}${site.appsRoutes.getCitiesByGov}`,
        city,
        {
          headers: site.requestHeaders().headers,
        },
      )
      .pipe(retry(5));
  }

  getAllCities(pagination?: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City[] }>(
        `${this.citiesUrl}${site.appsRoutes.getAll}`,
        pagination,
        {
          headers: site.requestHeaders().headers,
        },
      )
      .pipe(retry(5));
  }

  getActiveCities() {
    return this.http
      .post<{
        success: boolean;
        message: string;
        data: City[];
      }>(`${this.citiesUrl}${site.appsRoutes.getActive}`, null)
      .pipe(retry(5));
  }

  viewCity(city: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City }>(
        `${this.citiesUrl}${site.appsRoutes.view}`,
        city,
        {
          headers: site.requestHeaders().headers,
        },
      )
      .pipe(retry(5));
  }
}
