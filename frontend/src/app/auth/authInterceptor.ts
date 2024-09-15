import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * Intercepts HTTP requests and handles unauthorized (401) errors by redirecting the user to the authentication page.
 * @param request The outgoing HTTP request to be intercepted.
 * @param next The next interceptor or the backend handler.
 * @returns An Observable that emits HttpEvents.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/auth']);
        }
        return throwError(error);
      })
    );
  }
}
