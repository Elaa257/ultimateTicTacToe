// user.service.ts
import {Injectable, HttpException, HttpStatus, Res} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User} from "../../database/User";
import {registerDTO} from "./DTOs/registerDTO";
import * as crypto from 'crypto';
import {loginDTO} from "./DTOs/loginDTO";
import {JwtService} from "@nestjs/jwt";
import {Response} from "express";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(registerDTO: registerDTO): Promise<User> {
        await this.validateRegisterInputs(registerDTO.email, registerDTO.password, registerDTO.nickname);

        const user = this.userRepository.create({
            ...registerDTO,
            password: this.hashPassword(registerDTO.password),
        });
        return this.userRepository.save(user);
    }

    async validateRegisterInputs(email: string, password: string, nickname: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
        }
        if (email.trim().length === 0 || nickname.trim().length === 0) {
            throw new HttpException('You need to choose valid characters', HttpStatus.BAD_REQUEST);
        }
        if (!email.includes('@')) {
            throw new HttpException('The email is invalid, needs to contain "@" symbol', HttpStatus.BAD_REQUEST);
        }
        if (password.length < 8 || password.trim().length === 0) {
            throw new HttpException('The password must contain more than 8 characters', HttpStatus.BAD_REQUEST);
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

    async login(loginDTO: loginDTO): Promise<{ access_token: string, user: Partial<User> }> {
        const user = await this.validateUser(loginDTO.email, loginDTO.password);
        const payload = { sub: user.id, username: user.nickname, email: user.email };
        const access_token = await this.jwtService.signAsync(payload);

        const { password, ...userWithoutPassword } = user;
        return { access_token, user: userWithoutPassword };
    }

    private hashPassword(password: string): string {
        return crypto.createHmac('sha256', password).digest('hex');
    }

    private comparePassword(password: string, storedPasswordHash: string): boolean {
        const hashedPassword = this.hashPassword(password);
        return hashedPassword === storedPasswordHash;
    }



    async delete(id: number){

        return await this.userRepository.delete(id)
    }
}
