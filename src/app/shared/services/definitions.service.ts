import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Language, site } from '..';

@Injectable({
  providedIn: 'root',
})
export class DefinitionsService {
  languageUrl = `${environment.url}${site.api}${site.apps.languages}`;

  constructor(private http: HttpClient) {}

  getActiveLanguages() {
    return this.http.post<{
      success: boolean;
      message: string;
      data: Language[];
    }>(`${this.languageUrl}${site.appsRoutes.getActive}`, null);
  }
}
