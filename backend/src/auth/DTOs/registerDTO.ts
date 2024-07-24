import {Role} from "../roles/enum.roles";
import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class RegisterDTO{

    @IsNotEmpty()
    nickname:string;

    @IsEmail()
    email:string;

    @IsNotEmpty()
    @MinLength(8)
    password:string;

    role?: string;
}