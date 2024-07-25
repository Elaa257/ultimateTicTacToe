import {ApiProperty} from "@nestjs/swagger";

export class UpdateGameRequestDto {
    @ApiProperty()
    board: number[]

    constructor(board: number[]) {
        this.board = board
    }
}