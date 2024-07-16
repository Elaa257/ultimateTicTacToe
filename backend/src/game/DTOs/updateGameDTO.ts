import {User} from "../../user/user.entity";

export class UpdateGameDTO {
    winner: User;
    loser: User;
    player1EloAfter: number;
    player2EloAfter: number;

    constructor(winner: User, loser: User, player1: User, player2: User) {
        this.winner = winner;
        this.loser = loser;
        this.player1EloAfter = player1.elo;
        this.player2EloAfter = player2.elo;
    }
}