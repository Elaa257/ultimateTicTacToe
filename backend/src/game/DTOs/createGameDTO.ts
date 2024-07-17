import {User} from "../../user/user.entity";

export class CreateGameDTO {
    player1: User;
    player2: User;
    player1EloBefore: number;
    player2EloBefore: number;
    board: number[];
    turn: User;

    constructor(player1: User, player2: User) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1EloBefore = player1.elo;
        this.player2EloBefore = player2.elo;
        this.board = new Array(9).fill(null);
        this.turn = Math.random() < 0.5 ? player1 : player2;
    }
}