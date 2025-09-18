// src/app/core/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/login')) return next(req); // no adjuntar en login

  const token = localStorage.getItem('auth_token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    // log temporal para confirmar:
    console.log('[AUTH INT]', req.url, req.headers.get('Authorization'));
  } else {
    console.warn('[AUTH INT] sin token para', req.url);
  }
  return next(req);
};
