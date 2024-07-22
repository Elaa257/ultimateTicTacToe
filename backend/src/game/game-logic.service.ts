import { Injectable } from '@nestjs/common';
import {Game} from "./game.entity";
import {EndGameDTO} from "./DTOs/endGameDTO";

//TODO: add elo calculation before creating new EndGameDTO -> will be part of the user service
@Injectable()
export class GameLogicService {

    //checks whether there is winner or if the game is draw
    calculateGameOutcome(game: Game): EndGameDTO {
        const board: number[] = game.board;

        const rows: number[][] =
            [[0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]];

        let sum: number;
        let endGameDTO: EndGameDTO;

        for (const row of rows) {
            if(board[row[0]] === null || board[row[1]] === null || board[row[2]] === null) continue;
            sum = board[row[0]] + board[row[1]] + board[row[2]];
            if (sum === 3) {
                endGameDTO = new EndGameDTO(game.player2, game.player1, game.player1, game.player2, false);
                return endGameDTO;
            }
            if (sum === 0) {
                endGameDTO = new EndGameDTO(game.player1, game.player2, game.player1, game.player2, false);
                return endGameDTO;
            }
        }

        if(this.gameIsFinished(game)) {
            endGameDTO = new EndGameDTO(null, null, game.player1, game.player2, true);
            return endGameDTO;
        }

        return null;
    }

    //checks whether all fields are occupied
    gameIsFinished(game: Game): boolean {
        const board: number[] = game.board;

        const rows: number[][] =
            [[0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]];

        for (const row of rows) {
            if(board[row[0]] === null || board[row[1]] === null || board[row[2]] === null) return false;
        }
        return true;
    }

}
