// user.service.ts
import {Injectable, HttpException, HttpStatus, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import { Repository } from 'typeorm';
import {registerDTO} from "./DTOs/registerDTO";
import * as crypto from 'crypto';
import {loginDTO} from "./DTOs/loginDTO";
import {JwtService} from "@nestjs/jwt";
import {UpdateDTO} from "./DTOs/updateDTO";
import {User} from "../user/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(registerDTO: registerDTO): Promise<User> {        const user = this.userRepository.create({
            ...registerDTO,
            password: this.hashPassword(registerDTO.password),
            role: registerDTO.role
        });
        return this.userRepository.save(user);
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
        const payload = { sub: user.id, username: user.nickname, email: user.email, role: user.role };
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

    async getUser(id:number){
        return await this.userRepository.findOne({ where: { id } });
    }
    async getUsers(){
        return await this.userRepository.find();
    }

    async updateUser(nickname: string, updateUser: UpdateDTO): Promise<UpdateResult> {
        if(!updateUser){
            throw new HttpException("User not Fund", 404)
        }
        return await this.userRepository.update(nickname, {
            ...updateUser,
            password: this.hashPassword(updateUser.password)
        });
    }

    async deleteUserProfile(nickname: string){
        return await this.userRepository.delete(nickname);
    }

    async delete(id: number){
        return await this.userRepository.delete(id)
    }
}
