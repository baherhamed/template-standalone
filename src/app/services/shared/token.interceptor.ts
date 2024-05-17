import { HttpInterceptorFn } from '@angular/common/http';
import { site } from 'src/app/shared';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(site.token);
  const language = localStorage.getItem(site.currentLangValue);
  const authReq = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('accept-language', `${language}`)
      .set('Authorization', `Bearer ${token}`),
  });
  return next(authReq);
};
