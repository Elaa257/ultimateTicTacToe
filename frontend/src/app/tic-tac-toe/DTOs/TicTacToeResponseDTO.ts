import { UserDTO } from "../../profile/DTOs/userDTO";

export interface TicTacToeResponseDTO {
    messasge: string;
    id: number;
    finished: boolean;
    draw: boolean;
    board: number[];
    turn: UserDTO;
    player1: UserDTO;
    player2: UserDTO;
    winner: UserDTO;
    loser: UserDTO;
    time: Date;
    player1EloBefore: number;
    player2EloBefore: number;
    player1EloAfter: number;
    player2EloAfter: number;
}