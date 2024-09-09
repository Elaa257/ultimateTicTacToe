import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { RegisterDTO } from './DTOs/RegisterDTO';
import { UserResponseDTO } from './DTOs/UserResponseDTO';
import { LoginDTO } from './DTOs/LoginDTO';
import { LogOutDTO } from './DTOs/LogoutDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'backend/auth';
  private isAuthenticatedCache: boolean | null = null;
  private authCheckTimestamp: number | null = null;
  private readonly cacheDuration = 5 * 60 * 1000; // Cache duration 5min
  constructor(private http: HttpClient, private router: Router) { }

  register(registerDTO: RegisterDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/register`, registerDTO, { withCredentials: true }).pipe(
      tap(response => {
        if (response.ok) {
          this.isAuthenticatedCache = true; // Update cache on successful register
          this.authCheckTimestamp = Date.now(); // Update the timestamp on successful register

          if (response.user?.role === 'user') {
            this.router.navigate(['/profile']);
          } else if (response.user?.role === 'admin') {
            this.router.navigate(['/admin']);
          }
        }
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    const now = Date.now();

    if (this.isAuthenticatedCache !== null && this.authCheckTimestamp && (now - this.authCheckTimestamp < this.cacheDuration)) {
      return of(this.isAuthenticatedCache);
    }

    return this.http.get<{ isAuthenticated: boolean }>(`${this.apiUrl}/auth-check`, { withCredentials: true }).pipe(
      map(response => response.isAuthenticated),
      tap(isAuthenticated => {
        this.isAuthenticatedCache = isAuthenticated;
        this.authCheckTimestamp = Date.now();
        if (!isAuthenticated) {
          this.router.navigate(['/auth']);
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/auth']);
        }
        this.isAuthenticatedCache = false;
        this.authCheckTimestamp = Date.now();
        return of(false);
      })
    );
  }

  login(loginDTO: LoginDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/login`, loginDTO, { withCredentials: true }).pipe(
      tap(response => {
        if (response.ok) {
          this.isAuthenticatedCache = true; // Update cache on successful login
          this.authCheckTimestamp = Date.now(); // Update the timestamp on successful login
          if (response.user?.role === 'user') {
            this.router.navigate(['/profile']);
          } else if (response.user?.role === 'admin') {
            this.router.navigate(['/admin']);
          }
        }
      })
    );
  }

  logout(): Observable<LogOutDTO> {
    return this.http.post<LogOutDTO>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response && response.ok) {
          this.isAuthenticatedCache = null; // Invalidate cache on logout
          this.authCheckTimestamp = null;
          this.router.navigate(['/auth']); // Redirect to auth page on logout
        } else {
          console.error('Logout response not OK:', response?.message);
        }
      }),
      catchError(error => {
        console.error('Logout failed:', error);
        return of({ ok: false, message: 'Logout failed' } as LogOutDTO);
      })
    );
  }

  getCurrentUser(): Observable<any>{
    return this.http.get(`${this.apiUrl}/current-user`);
  }
}

