import {IsEmail, IsNotEmpty, IsOptional, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDTO{

    @IsNotEmpty()
    @ApiProperty()
    nickname:string;

    @IsEmail()
    @ApiProperty()
    email:string;

    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    password:string;

    @IsOptional()
    @ApiProperty()
    role?: string;
}