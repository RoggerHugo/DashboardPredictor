// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No adjuntar token al login
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  const token = localStorage.getItem('auth_token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Log temporal para verificar que el token está viajando
    console.log('[AUTH-INT] Token agregado a', req.url, cloned.headers.get('Authorization'));
    return next(cloned);
  } else {
    console.warn('[AUTH-INT] No hay token en localStorage para', req.url);
  }

  return next(req);
};
