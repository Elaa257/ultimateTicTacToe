import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MultiTicTacToeResponseDTO } from './DTOs/MultiTicTacToeResponseDTO';
import { Observable } from 'rxjs';
import { TicTacToeResponseDTO } from './DTOs/TicTacToeResponseDTO';
import { CreateTicTacToeRequestDto } from './DTOs/CreateTicTacToeRequestDto';
import { ResponseDTO } from './DTOs/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {
  private apiUrl = 'backend/game'; // URL of your backend API

  constructor(private http: HttpClient) {}

  // Get all games
  getGames(gameId: number): Observable<MultiTicTacToeResponseDTO> {
    return this.http.get<MultiTicTacToeResponseDTO>(`${this.apiUrl}`);
  }

  // Get a specific game
  getGame(id: number): Observable<TicTacToeResponseDTO> {
    return this.http.get<TicTacToeResponseDTO>(`${this.apiUrl}/${id}`);
  }

  // Create a new game
  createGame(createGameRequestDto: CreateTicTacToeRequestDto): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(this.apiUrl, createGameRequestDto);
  }

}