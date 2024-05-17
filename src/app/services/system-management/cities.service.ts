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
  citiesUrl = `${environment.url}${site.api}${site.modules.systemManagement}${site.apps.cities}`;
  token = localStorage.getItem(site.token);
  language = localStorage.getItem(site.currentLangValue);

  constructor(private http: HttpClient) {}

  addCity(city: any): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        message: string;
        data: City;
      }>(`${this.citiesUrl}${site.appsRoutes.add}`, city)
      .pipe(retry(5));
  }

  updateCity(city: any): Observable<any> {
    return this.http
      .put<{ success: boolean; message: string; data: City }>(
        `${this.citiesUrl}${site.appsRoutes.update}`,
        city,
      )
      .pipe(retry(5));
  }

  deleteCity(city: any): Observable<any> {
    return this.http
      .put<{ success: boolean; message: string; data: City }>(
        `${this.citiesUrl}${site.appsRoutes.delete}`,
        city,
      )
      .pipe(retry(5));
  }

  searchCity(city: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City[] }>(
        `${this.citiesUrl}${site.appsRoutes.search}`,
        city,
      )
      .pipe(retry(5));
  }

  getCitiesByGov(city: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City[] }>(
        `${this.citiesUrl}${site.appsRoutes.getCitiesByGov}`,
        city,
      )
      .pipe(retry(5));
  }

  getAllCities(pagination?: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City[] }>(
        `${this.citiesUrl}${site.appsRoutes.getAll}`,
        pagination,
      )
      .pipe(retry(5));
  }

  getActiveCities() {
    return this.http
      .post<{ success: boolean; message: string; data: City[] }>(
        `${this.citiesUrl}${site.appsRoutes.getActive}`,
        null,
      )
      .pipe(retry(5));
  }
  viewCity(gov: any): Observable<any> {
    return this.http
      .post<{ success: boolean; message: string; data: City }>(
        `${this.citiesUrl}${site.appsRoutes.view}`,
        gov,
      )
      .pipe(retry(5));
  }
}
