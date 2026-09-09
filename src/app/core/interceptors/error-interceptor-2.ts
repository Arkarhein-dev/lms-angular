import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, throwError } from 'rxjs';

interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  validationErrors?: Record<string, string>;
}

export const errorInterceptor2: HttpInterceptorFn = (req, next) => {
  const notification = inject(NzNotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorTitle = 'Error';
      let errorMessage = 'Default Error Message';
      let effectiveErrorStatus = error.error;

      if (error.error && typeof error.error === 'object') {
        const apiError: ApiErrorResponse = error.error;
        if (apiError.status) effectiveErrorStatus = apiError.status;
        if (apiError.message) errorMessage = apiError.message;

        switch (effectiveErrorStatus) {
          case 400:
            notification.error('Bad Request', errorMessage);
            break;
          case 401:
            notification.warning('Unauthorized', errorMessage);
            break;
          case 403:
            notification.error('Forbidden', errorMessage);
            break;
          case 404:
            notification.error('Not Found', errorMessage);
            break;
          case 500:
            notification.error('Server Error', errorMessage);
            break;
          default:
            notification.error(errorTitle, errorMessage);
        }
      }

      return throwError(() => error);
    }),
  );
};
