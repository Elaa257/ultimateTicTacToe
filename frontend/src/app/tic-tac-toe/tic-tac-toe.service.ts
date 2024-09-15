import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicTacToeResponseDTO } from './DTOs/TicTacToeResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {
  private apiUrl = 'backend/game';
  private _gameId: number | null = null;

  get gameId(): number | null {
    return this._gameId;
  }

  set gameId(id: number | null) {
    this._gameId = id;
  }

  constructor(private http: HttpClient) {}

  // Get a specific game
  getGame(gameId: number|null = this.gameId): Observable<TicTacToeResponseDTO> {
    return this.http.get<TicTacToeResponseDTO>(`${this.apiUrl}/${gameId}`);
  }

}
