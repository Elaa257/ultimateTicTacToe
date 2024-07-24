import {User} from "../user.entity";
import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";

export class ResponseUserDTO {
    @IsOptional()
    @ApiProperty()
    user?: User;

    @ApiProperty()
    message:string;

    constructor(message:string, user?:User){
        this.message = message;
        this.user = user;
    }
}