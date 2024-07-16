import {Game} from "../game/game.entity";

export class CreateMatchfieldDTO {
    position: number;
    game: Game;

    constructor(position: number) {
        this.position = position;
    }
}