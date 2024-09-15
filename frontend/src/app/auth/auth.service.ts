import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { RegisterDTO } from './DTOs/RegisterDTO';
import { UserResponseDTO } from './DTOs/UserResponseDTO';
import { LoginDTO } from './DTOs/LoginDTO';
import { LogOutDTO } from './DTOs/LogoutDTO';
import { ResponseDTO } from '../profile/DTOs/responseDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'backend/auth';
  private isAuthenticatedCache: boolean | null = null;
  private authCheckTimestamp: number | null = null;
  private readonly cacheDuration = 5 * 60 * 1000;

  constructor(private http: HttpClient, private router: Router) { }


  /**
 * Registers a new user.
 * Upon successful registration, updates the authentication cache
 * and navigates the user based on their role.
 * 
 * @param registerDTO - The user registration data.
 * @returns An observable of the UserResponseDTO containing registration result.
 */
  public register(registerDTO: RegisterDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/register`, registerDTO, { withCredentials: true }).pipe(
      tap(response => {
        if (response.ok) {
          this.updateAuthCache(true);
          this.navigateByRole(response.user?.role);
        }
      }),
      catchError(this.handleError<UserResponseDTO>('register'))
    );
  }

  /**
 * Checks if the user is authenticated.
 * Utilizes caching to avoid unnecessary HTTP requests.
 * 
 * @returns An observable of boolean indicating whether the user is authenticated.
 */
  public isAuthenticated(): Observable<boolean> {
    const now = Date.now();

    if (this.isAuthenticatedCache !== null && this.authCheckTimestamp && (now - this.authCheckTimestamp < this.cacheDuration)) {
      return of(this.isAuthenticatedCache);
    }

    return this.http.get<{ isAuthenticated: boolean }>(`${this.apiUrl}/auth-check`, { withCredentials: true }).pipe(
      map(response => response.isAuthenticated),
      tap(isAuthenticated => {
        this.updateAuthCache(isAuthenticated);
        if (!isAuthenticated) {
          this.router.navigate(['/auth']);
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/auth']);
        }
        this.updateAuthCache(false);
        return of(false);
      })
    );
  }

  /**
 * Logs in a user with the provided credentials.
 * Updates the authentication cache and navigates based on the user's role.
 * 
 * @param loginDTO - The user login data.
 * @returns An observable of the UserResponseDTO containing login result.
 */
  public login(loginDTO: LoginDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/login`, loginDTO, { withCredentials: true }).pipe(
      tap(response => {
        if (response.ok) {
          this.updateAuthCache(true);
          this.navigateByRole(response.user?.role);
        }
      }),
      catchError(this.handleError<UserResponseDTO>('login'))
    );
  }

  /**
 * Logs out the current user.
 * Clears the authentication cache and redirects to the authentication page.
 * 
 * @returns An observable of LogOutDTO containing logout result.
 */
  public logout(): Observable<LogOutDTO> {
    return this.http.post<LogOutDTO>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response.ok) {
          this.clearAuthCache();
          this.router.navigate(['/auth']);
        } else {
          console.error('Logout response not OK:', response.message);
        }
      }),
      catchError(error => {
        console.error('Logout failed:', error);
        return of({ ok: false, message: 'Logout failed' } as LogOutDTO);
      })
    );
  }

  /**
 * Retrieves the current user's data.
 * 
 * @returns An observable of ResponseDTO containing current user data.
 */
  getCurrentUser(): Observable<ResponseDTO> {
    return this.http.get<ResponseDTO>(`${this.apiUrl}/current-user`);
  }

  /**
 * Updates the authentication cache with the provided value.
 * Stores the current timestamp for cache expiration checks.
 * 
 * @param isAuthenticated - Boolean indicating if the user is authenticated.
 */
  private updateAuthCache(isAuthenticated: boolean): void {
    this.isAuthenticatedCache = isAuthenticated;
    this.authCheckTimestamp = Date.now();
  }

  /**
  * Navigates the user based on their role.
  * Redirects the user to either profile or admin page.
  * 
  * @param role - The role of the authenticated user (e.g., 'admin', 'user').
  */
  private navigateByRole(role?: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'user':
      default:
        this.router.navigate(['/profile']);
        break;
    }
  }

  /**
 * Handles HTTP errors in a consistent manner across all HTTP requests.
 * Logs the error and returns a fallback value.
 * 
 * @param operation - The name of the operation that failed.
 * @param result - A fallback value to return in case of error.
 * @returns A function that returns an observable of the fallback result.
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  /**
 * Clears the authentication cache, resetting the stored values.
 */
  private clearAuthCache(): void {
    this.isAuthenticatedCache = null;
    this.authCheckTimestamp = null;
  }

}

