import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from './DTOs/userDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/backend/user'; // Adjust this to match your backend API URL

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDTO[]> {
     const response = this.http.get<UserDTO[]>(this.apiUrl);
    console.log("users: " + response);
    return response;
  }
}
