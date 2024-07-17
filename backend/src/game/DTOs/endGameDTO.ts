import {User} from "../../user/user.entity";

export class EndGameDTO {
    winner: User;
    loser: User;
    player1EloAfter: number;
    player2EloAfter: number;
    draw: boolean;
    finished: boolean;

    constructor(winner: User, loser: User, player1: User, player2: User, draw: boolean) {
        this.winner = winner;
        this.loser = loser;
        this.player1EloAfter = player1.elo;
        this.player2EloAfter = player2.elo;
        this.draw = draw;
        this.finished = true;
    }
}