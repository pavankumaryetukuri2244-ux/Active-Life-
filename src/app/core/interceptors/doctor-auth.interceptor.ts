import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DoctorAuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isDoctorEndpoint =
      req.url.includes('doctorservice') ||
      req.url.includes(':8098') ||
      req.url.includes('healthappdashboard') ||
      req.url.includes(':8095');

    if (!isDoctorEndpoint) {
      return next.handle(req);
    }

    const token = (
      localStorage.getItem('accessToken') ||
      localStorage.getItem('doctor_token') ||
      sessionStorage.getItem('accessToken') ||
      ''
    ).trim();

    let clonedRequest = req;
    if (token && !req.headers.has('Authorization')) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        const userRole = (localStorage.getItem('userRole') || '').trim().toUpperCase();
        if (error.status === 401 && userRole === 'DOCTOR') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('doctor_token');
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.removeItem('userRole');
          localStorage.removeItem('doctorPortalState');
          localStorage.removeItem('doctorMobile');
          localStorage.removeItem('doctorCountryCode');
          this.router.navigate(['/pages/login-boxed'], {
            queryParams: { sessionExpired: 'true' }
          });
        }
        return throwError(() => error);
      })
    );
  }
}
