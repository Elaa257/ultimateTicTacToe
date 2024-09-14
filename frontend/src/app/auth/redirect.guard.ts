import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.getCurrentUser().pipe(
      map(user => {
        // If the user is an admin and tries to access the profile page
        if (user && user.user?.role === 'admin' && state.url === '/profile') {
          this.router.navigate(['/admin']);
          return false;
        }
        // If the user is a normal user and tries to access the admin page
        if (user && user.user?.role  === 'user' && state.url === '/admin') {
          this.router.navigate(['/profile']);
          return false;
        }
        // Allow access if no role conflict
        return true;
      })
    );
  }
}
