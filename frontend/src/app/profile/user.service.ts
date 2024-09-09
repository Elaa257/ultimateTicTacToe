import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO, UsersDTO } from './DTOs/userDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'backend/user';
  private apiAuthUrl = 'backend/auth';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UsersDTO> {
     const response = this.http.get<UsersDTO>(this.apiUrl, { withCredentials: true });
    console.log("users: " + response);
    return response;
  }
  getProfile():Observable<any>{
    const response = this.http.get(`${this.apiAuthUrl}/current-user`);
    console.log('user from getProfile' + response);
    return response;
  }
}
