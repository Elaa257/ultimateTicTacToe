import { UserDTO } from './userDTO';

export interface ResponseDTO {
  ok?:boolean;
  message?:string;
  payload?:Payload;
  user?:UserDTO;
}

export interface GameDTO {
  id: number;
  finished: boolean;
  draw: boolean;
  board: number[]; // Array mit 9 Elementen: 0 = Kreis (Player1), 1 = Kreuz (Player2)
  turn: UserDTO; // Aktueller Spieler am Zug
  player1: UserDTO; // Spieler 1
  player2: UserDTO; // Spieler 2
  winner: UserDTO; // Gewinner des Spiels
  loser: UserDTO; // Verlierer des Spiels
  time: Date; // Datum und Uhrzeit des Spiels
  player1EloBefore: number; // Elo von Spieler 1 vor dem Spiel
  player2EloBefore: number; // Elo von Spieler 2 vor dem Spiel
  player1EloAfter: number; // Elo von Spieler 1 nach dem Spiel
  player2EloAfter: number; // Elo von Spieler 2 nach dem Spiel
  users?: UserDTO[]; // Liste der beteiligten Benutzer (falls relevant)
}


export interface Payload{
  currentPassword:string;
  newPassword:string;
  email:string;
}
