import {User} from "../../user/user.entity";
import {ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDate, IsInt} from "class-validator";
import {Game} from "../game.entity";
import {ApiProperty} from "@nestjs/swagger";

export class GameResponseDto {
    message: string;
    @IsInt()
    @ApiProperty()
    id: number;
    @IsBoolean()
    @ApiProperty()
    finished: boolean;
    @IsBoolean()
    @ApiProperty()
    draw: boolean;
    @IsArray()
    @ArrayMaxSize(9)
    @ArrayMinSize(9)
    @ApiProperty()
    board: number[];
    @ApiProperty()
    turn: User;
    @ApiProperty()
    player1: User;
    @ApiProperty()
    player2: User;
    @ApiProperty()
    winner: User;
    @ApiProperty()
    loser: User;
    @IsDate()
    @ApiProperty()
    time: Date;
    @IsInt()
    @ApiProperty()
    player1EloBefore: number;
    @IsInt()
    @ApiProperty()
    player2EloBefore: number;
    @IsInt()
    @ApiProperty()
    player1EloAfter: number;
    @IsInt()
    @ApiProperty()
    player2EloAfter: number;

    constructor(message: string, game?: Game) {
        this.message = message;
        this.id = game.id;
        this.finished = game.finished;
        this.draw = game.draw;
        this.board = game.board;
        this.turn = game.turn;
        this.player1 = game.player1;
        this.player2 = game.player2;
        this.winner = game.winner;
        this.loser = game.loser;
        this.time = game.time;
        this.player1EloBefore = game.player1EloBefore;
        this.player2EloBefore = game.player2EloBefore;
        this.player1EloAfter = game.player1EloAfter;
        this.player2EloAfter = game.player2EloAfter;
    }
}