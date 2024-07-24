import {IsEmail, IsNotEmpty, IsOptional, MinLength} from "class-validator";

export class UpdateDTO {
    @IsOptional()
    @IsNotEmpty()
    nickname?:string;

    @IsEmail()
    @IsOptional()
    email?:string;

    @IsOptional()
    @IsNotEmpty()
    @MinLength(8)
    password?:string;
}