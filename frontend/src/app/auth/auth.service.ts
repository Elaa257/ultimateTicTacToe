import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

interface RegisterDTO {
  nickname: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  ok: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/backend/auth'

  constructor(private http: HttpClient) { }

  register(registerDTO: RegisterDTO): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.apiUrl}/register`, registerDTO);
  }

  login(loginDTO: LoginDTO): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.apiUrl}/login`, loginDTO, { withCredentials: true });
  }

  logout(): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

}

