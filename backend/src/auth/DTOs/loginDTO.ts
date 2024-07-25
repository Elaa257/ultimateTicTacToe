import {ApiProperty} from "@nestjs/swagger";

export class LoginDTO {
    @ApiProperty()
    password: string;
    @ApiProperty()
    email: string
}