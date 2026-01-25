// import {
//   HttpEvent,
//   HttpHandlerFn,
//   HttpInterceptorFn,
//   HttpRequest,
// } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError, Observable, throwError } from 'rxjs';
// import { AuthStore } from '../state/auth.store';

// /**
//  * Interceptor funcional (Angular moderno) que:
//  * - Lee el token del AuthStore.
//  * - Lo inyecta en Authorization: Bearer <token>.
//  * - Interpreta 401/403 para redirigir a login si corresponde.
//  */
// export const authTokenInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<unknown>,
//   next: HttpHandlerFn,
// ): Observable<HttpEvent<unknown>> => {
//   const authStore = inject(AuthStore);
//   const router = inject(Router);

//   const token = authStore.token();

//   let authReq = req;

//   if (token) {
//     authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }

//   return next(authReq).pipe(
//     catchError((error) => {
//       if (error.status === 401 || error.status === 403) {
//         authStore.logout();
//         router.navigate(['/auth/login']);
//       }
//       return throwError(() => error);
//     }),
//   );
// };

import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthStore } from '../state/auth.store';

/**
 * Interceptor funcional (Angular moderno) que:
 * - Lee el token del AuthStore.
 * - Lo inyecta en Authorization: Bearer <token>.
 * - Interpreta 401/403 para redirigir a login si corresponde.
 */
export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const token = authStore.token();

  // Determinar si la petición es a un endpoint de autenticación
  const isAuthRequest = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');

  let authReq = req;

  // Solo añadir el token si existe Y NO es una petición de autenticación
  if (token && !isAuthRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Si el error es 401 o 403, y NO es una petición de login, redirigir.
      // Esto evita bucles de redirección si el propio login falla.
      if ((error.status === 401 || error.status === 403) && !isAuthRequest) {
        authStore.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};