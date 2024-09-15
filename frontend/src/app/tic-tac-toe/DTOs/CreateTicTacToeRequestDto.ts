import { UserDTO } from "../../profile/DTOs/userDTO";


export interface CreateTicTacToeRequestDto {
  player1: UserDTO;
  player2: UserDTO;
  player1EloBefore: number;
  player2EloBefore: number;
  board: number[];
  turn: UserDTO;           
}
