import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO, UsersDTO } from './DTOs/userDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'backend/user'; // Adjust this to match your backend API URL

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UsersDTO> {
     const response = this.http.get<UsersDTO>(this.apiUrl, { withCredentials: true });
    console.log("users: " + response);
    return response;
  }
}
