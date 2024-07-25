import {Game} from "../game.entity";
import {IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class MultiGamesResponseDTO {
    @IsOptional()
    @ApiProperty()
    games?: Game[];
    @ApiProperty()
    message:string;
    constructor(message:string, games?:Game[]){
        this.message = message;
        this.games = games;
    }
}