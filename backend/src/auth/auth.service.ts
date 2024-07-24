// auth.service.ts
import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ResponseDTO} from '../DTOs/responseDTO';
import {RegisterDTO} from "./DTOs/registerDTO";
import * as crypto from 'crypto';
import {LoginDTO} from "./DTOs/loginDTO";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/user.entity";
import {SessionData} from "express-session";
import {ResponseUserDTO} from "../user/DTOs/responseUserDTO";
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(registerDTO: RegisterDTO): Promise<ResponseDTO> {
        try {
            const user = this.userRepository.create({
                ...registerDTO,
                password: this.hashPassword(registerDTO.password),
                role: registerDTO.role
            });
            await this.userRepository.save(user);
            return new ResponseDTO(true, "Successfully created new user");
        } catch(error) {
            return new ResponseDTO(false, `New user could not be created ${error}` );
        }
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (!this.comparePassword(password, user.password)) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async login(loginDTO: LoginDTO, session: SessionData): Promise<{ access_token?: string, response:ResponseDTO}> {
        try {
            const user = await this.validateUser(loginDTO.email, loginDTO.password);
            session.isLoggedIn = true;
            const payload = { sub: user.id, username: user.nickname, email: user.email, role: user.role };
            const access_token = await this.jwtService.signAsync(payload);

            return { access_token, response: new ResponseDTO(true, `User: ${user.nickname}, has successfully logged in`)};
        } catch(error) {
            return {response: new ResponseDTO(false, `Login failed ${error}`)};
        }
    }

    hashPassword(password: string): string {
        return crypto.createHmac('sha256', password).digest('hex');
    }

    private comparePassword(password: string, storedPasswordHash: string): boolean {
        const hashedPassword = this.hashPassword(password);
        return hashedPassword === storedPasswordHash;
    }


    async getLoggedInUser(session:SessionData): Promise<ResponseUserDTO>{
        if (!session.isLoggedIn){
            return new ResponseUserDTO("Unauthorized");
        }

        try {
            const user = await this.userRepository.findOne({ where: {email: session.email } });
            return new ResponseUserDTO(`User with the ID: ${user.id} is logged in`,user);
        }catch (error){
            return new ResponseUserDTO(`user couldn't found ${error}`)
        }



    }
}
