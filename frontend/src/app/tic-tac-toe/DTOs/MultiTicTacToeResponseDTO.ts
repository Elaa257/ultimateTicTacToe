import { TicTacToe } from "./TicTacToe";

export interface MultiTicTacToeResponseDTO {
    games?: TicTacToe[];
    message: string;
}