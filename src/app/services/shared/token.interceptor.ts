import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const language = localStorage.getItem('language');
  const authReq = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('accept-language', `${language}`)
      .set('Authorization', `Bearer ${token}`),
  });
  return next(authReq);
};
