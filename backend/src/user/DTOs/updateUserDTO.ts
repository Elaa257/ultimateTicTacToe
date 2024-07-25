import {IsEmail, IsNotEmpty, IsOptional, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDTO {
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    nickname?:string;

    @IsEmail()
    @IsOptional()
    @ApiProperty()
    email?:string;

    @IsOptional()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    password?:string;
}