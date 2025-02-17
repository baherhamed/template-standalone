
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';

import { importProvidersFrom } from '@angular/core';
import {  HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app/routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import {  MatDialogModule } from '@angular/material/dialog';
import { ToastrModule  } from 'ngx-toastr';
import { loggerInterceptor, site } from './app/shared';



export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }
  
bootstrapApplication(AppComponent, {
    providers: [
      provideAnimations(), 
     provideRouter(routes),
        importProvidersFrom(HttpClient), 
        importProvidersFrom(ToastrModule.forRoot()),         
        importProvidersFrom(MatDialogModule), 
        importProvidersFrom(TranslateModule.forRoot({
            defaultLanguage: site.language.ar,
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient],
            },
          }),
        ),
        provideHttpClient(withInterceptors([loggerInterceptor]))

    ]
})

