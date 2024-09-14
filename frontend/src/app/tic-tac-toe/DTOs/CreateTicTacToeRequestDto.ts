import { UserDTO } from "../../profile/DTOs/userDTO";


export interface CreateTicTacToeRequestDto {
  player1: UserDTO;        // Spieler 1
  player2: UserDTO;        // Spieler 2
  player1EloBefore: number;  // ELO-Wertung vor dem Spiel für Spieler 1
  player2EloBefore: number;  // ELO-Wertung vor dem Spiel für Spieler 2
  board: number[];          // Tic-Tac-Toe Spielfeld (9 Zellen)
  turn: UserDTO;           // Der Spieler, der am Zug ist
}
