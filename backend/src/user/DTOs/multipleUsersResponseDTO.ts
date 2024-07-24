import {User} from "../user.entity";
import {IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class MultiUsersResponseDTO {
    @IsOptional()
    @ApiProperty()
    users?: User[];

    @ApiProperty()
    message:string;
    constructor(message:string, users?:User[]){
        this.message = message;
        this.users = users;
    }
}