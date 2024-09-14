import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersDTO } from './DTOs/userDTO';
import { MultiGamesResponseDTO } from './DTOs/gamesDTO';
import { GameDTO, Payload, ResponseDTO } from './DTOs/responseDTO';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = 'backend/user';
  private apiAuthUrl = 'backend/auth';
  private apiGameUrl = 'backend/game';

  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<UsersDTO> {
    const response = this.http.get<UsersDTO>(this.apiUrl, { withCredentials: true });
    console.log('users: ' + response);
    return response;
  }

  getAllUserGames(): Observable<MultiGamesResponseDTO> {
    const response = this.http.get<MultiGamesResponseDTO>(`{this.apiGameUrl}/userGames`, { withCredentials: true });
    console.log('users: ' + response);
    return response;
  }

  getProfile(): Observable<ResponseDTO> {
    const response = this.http.get(`${this.apiAuthUrl}/current-user`, { withCredentials: true });
    console.log('user from getProfile' + response);
    return response;
  }

  changePassword(currentPassword: string, newPassword: string, email: string):Observable<ResponseDTO> {
    const payload:Payload = { currentPassword, newPassword, email };
    console.log(payload);
    return this.http.put<ResponseDTO>(`${this.apiUrl}/change-password`, payload);
  }

  changeProfilePicture(img: string, email:string):Observable<ResponseDTO>{
    const payload = { profilePicture: img, email: email};
    console.log('sending payload: ', payload);
    return this.http.put(`${this.apiUrl}/change-img`, payload);
  }

  getGameHistory():Observable<MultiGamesResponseDTO>{
    const response = this.http.get<MultiGamesResponseDTO>(`${this.apiGameUrl}/userGames`);
      console.log("fetching Games for Users");
      console.log(response);
      return response;

  }
}

