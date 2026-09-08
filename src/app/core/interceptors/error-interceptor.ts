import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, throwError } from 'rxjs';

export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  validationErrors?: Record<string, string> | null;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NzNotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorTitle = 'System Error';

      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiErrorResponse;
        if (apiError.message) {
          errorMessage = apiError.message;
        }
      }

      switch (error.status) {
        case 400:
          errorTitle = 'Bad Request';
          notification.error(errorTitle, errorMessage);
          break;

        case 401:
          notification.warning('Unauthorized', 'Your session has expired. Please log in again.');
          router.navigate(['/auth/login']);
          break;

        case 403:
          notification.error('Forbidden', 'You do not have permission to perform this action.');
          break;

        case 404:
          notification.error('Not Found', errorMessage || 'Requested resource not found.');
          break;

        case 500:
          notification.error(
            'Server Error',
            'Internal server error occurred. Please try again later.',
          );
          break;

        default:
          notification.error(errorTitle, errorMessage);
          break;
      }

      return throwError(() => error);
    }),
  );
};
