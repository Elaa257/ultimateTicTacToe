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
  private _gameId: number | null = null; // Private variable to store gameId

  get gameId(): number | null {
    return this._gameId;
  }
  
  set gameId(id: number | null) {
    this._gameId = id;
  }

  constructor(private http: HttpClient) {}

  // Get all games
  getGames(gameId: number): Observable<MultiTicTacToeResponseDTO> {
    return this.http.get<MultiTicTacToeResponseDTO>(`${this.apiUrl}`);
  }

  // Get a specific game
  getGame(gameId: number|null = this.gameId): Observable<TicTacToeResponseDTO> {
    return this.http.get<TicTacToeResponseDTO>(`${this.apiUrl}/${gameId}`);
  }

  // Create a new game
  createGame(createGameRequestDto: CreateTicTacToeRequestDto): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(this.apiUrl, createGameRequestDto);
  }

}