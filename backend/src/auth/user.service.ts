// user.service.ts
import {Injectable, HttpException, HttpStatus, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import {Response} from './DTOs/responseDTO';
import {RegisterDTO} from "./DTOs/registerDTO";
import * as crypto from 'crypto';
import {LoginDTO} from "./DTOs/loginDTO";
import {JwtService} from "@nestjs/jwt";
import {UpdateDTO} from "./DTOs/updateDTO";
import {User} from "../user/user.entity";
import {SessionData} from "express-session";
import {ResponseUserDTO} from "./DTOs/responseUserDTO";
import {MultiUsersResponseDTO} from "./DTOs/multipleUsersResponseDTO";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(registerDTO: RegisterDTO): Promise<Response> {
        try {
            const user = this.userRepository.create({
                ...registerDTO,
                password: this.hashPassword(registerDTO.password),
                role: registerDTO.role
            });
            await this.userRepository.save(user);
            return new Response(true, "Successfully created new user");
        } catch(error) {
            return new Response(false, `New user could not be created ${error}` );
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

    async login(loginDTO: LoginDTO, session: SessionData): Promise<{ access_token?: string, response:Response}> {
        try {
            const user = await this.validateUser(loginDTO.email, loginDTO.password);
            session.isLoggedIn = true;
            const payload = { sub: user.id, username: user.nickname, email: user.email, role: user.role };
            const access_token = await this.jwtService.signAsync(payload);

            return { access_token, response: new Response(true, `User: ${user.nickname}, has successfully logged in`)};
        } catch(error) {
            return {response: new Response(false, `Login failed ${error}`)};
        }
    }

    private hashPassword(password: string): string {
        return crypto.createHmac('sha256', password).digest('hex');
    }

    private comparePassword(password: string, storedPasswordHash: string): boolean {
        const hashedPassword = this.hashPassword(password);
        return hashedPassword === storedPasswordHash;
    }

    async getUser(id:number): Promise<ResponseUserDTO>{
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            return new ResponseUserDTO(`User ${user.id} found successfully`, user);
        } catch(error) {
            return new ResponseUserDTO(`User with id ${id} could not be found`);
        }
    }

    async getUsers(): Promise<MultiUsersResponseDTO> {
        try {
            const users = await this.userRepository.find();
            return new MultiUsersResponseDTO('Successfully retrieved all avaible users', users);
        } catch(error) {
            return new MultiUsersResponseDTO(`Database error`);
        }
    }

    async updateUser(session:SessionData, updateUser: UpdateDTO): Promise<Response> {
        try {
            const userResponse = await this.getLoggedInUser(session)
            await this.userRepository.update(userResponse.user.id, {
                ...updateUser,
                password: this.hashPassword(updateUser.password)
            });
            return new Response(true,"updated Account successfully")
        } catch(error) {
            console.log(error);
            return new Response(false,"User could not be updated " + error);
        }
    }


    async deleteUserProfile(id: number){
        const user =  await this.userRepository.findOne({ where: { id: id } });
        if (!user){
            return new Response(false, "User not found");
        }
        try {
            await this.userRepository.delete(user.id);
            return new Response(true, "Account successfully deleted");
        }
        catch (error){
            return new Response(false, `User couldn't be deleted ${error}` );
        }

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
