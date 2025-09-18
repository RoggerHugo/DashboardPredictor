import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const httpLoggerInterceptor: HttpInterceptorFn = (req, next) => {
  const t0 = performance.now();
  console.log('[HTTP][REQ]', req.method, req.url, req);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          // @ts-ignore - status está en la respuesta final
          const status = event.status ?? (event as any).status;
          console.log(
            '[HTTP][RES]',
            req.method,
            req.url,
            status,
            `${(performance.now() - t0).toFixed(1)}ms`,
            event
          );
        }
      },
      error: (err) => {
        console.error('[HTTP][ERR]', req.method, req.url, err.status, err);
      },
    })
  );
};
