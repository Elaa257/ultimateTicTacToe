import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class UpdateDTO {
    @IsNotEmpty()
    nickname:string;

    @IsEmail()
    email:string;

    @IsNotEmpty()
    @MinLength(8)
    password:string;
}