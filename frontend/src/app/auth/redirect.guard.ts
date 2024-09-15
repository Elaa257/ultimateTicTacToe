import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
 * Determines whether the route can be activated based on the user's role and the requested route.
 * @param route The current route the user is attempting to access.
 * @param state The current state of the router, including the URL being navigated to.
 * @returns An Observable<boolean> that determines whether the route can be activated (true) or if the user should be redirected (false).
 */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.getCurrentUser().pipe(
      map(user => {

        if (user && user.user?.role === 'admin' && state.url === '/profile') {
          this.router.navigate(['/admin']);
          return false;
        }

        if (user && user.user?.role === 'user' && state.url === '/admin') {
          this.router.navigate(['/profile']);
          return false;
        }

        return true;
      })
    );
  }
}
