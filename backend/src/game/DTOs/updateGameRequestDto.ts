import {ApiProperty} from "@nestjs/swagger";

export class UpdateGameRequestDto {
    @ApiProperty()
    index: number;
    

    constructor(index: number) {
        this.index = index;
    }
}