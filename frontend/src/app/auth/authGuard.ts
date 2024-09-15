import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
 * Determines whether the route can be activated based on the user's authentication status.
 * @param next The next route to be activated.
 * @param state The current state of the router.
 * @returns An Observable<boolean> indicating whether the route can be activated (true) or not (false).
 */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/auth']);
        return of(false);
      })
    );
  }
}
