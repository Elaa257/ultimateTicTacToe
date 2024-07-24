import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param, ParseIntPipe,
    Post,
    Put, Req,
    Res, Session,
    UseGuards
} from '@nestjs/common';
import {RegisterDTO} from "./DTOs/registerDTO";
import {UserService} from "./user.service";
import {UpdateDTO} from "./DTOs/updateDTO";
import {Response} from './DTOs/responseDTO';
import {JwtAuthGuard} from "./jwt/auth.guard";
import {UpdateResult} from "typeorm";
import {Roles} from "./roles/roles.decorator";
import {Role} from "./roles/enum.roles";
import {RolesGuard} from "./roles/roles.guard";
import {User} from "../user/user.entity";
import {SessionData} from "express-session";
import {LoginDTO} from "./DTOs/loginDTO";
import {FastifyReply} from 'fastify';
import {ResponseUserDTO} from "./DTOs/responseUserDTO";
import {MultiUsersResponseDTO} from "./DTOs/multipleUsersResponseDTO";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('register')
    async register(@Body() registerDTO: RegisterDTO): Promise<Response> {
        return this.userService.register(registerDTO);
    }

    @Post('login')
    async login(
        @Session() session: SessionData,
        @Body() loginDto: LoginDTO,
        @Res() reply: FastifyReply
    ): Promise<Response> {
        const {access_token, response} = await this.userService.login(loginDto, session);
        reply
            .setCookie('access_token', access_token, {
                httpOnly: true, // Makes the cookie accessible only by web server
            })
        return response;

    }

    @Post('logout')
    async logout(
        @Session() session: SessionData,
        @Res() reply: FastifyReply
    ): Promise<Response> {
        reply.clearCookie('access_token');
        session.isLoggedIn = undefined;
        return new Response(true, "logged out successfully")
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('deleteUserProfile')
    async deleteOwnProfile(@Session() session: SessionData): Promise<Response> {
        const user = (await this.userService.getLoggedInUser(session)).user;
        return await this.userService.deleteUserProfile(user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('delete/:id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Response> {
        return await this.userService.deleteUserProfile(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:id')
    async getOneUser(@Param('id') id: string): Promise<ResponseUserDTO> {
        return await this.userService.getUser(Number(id));
    }

    @UseGuards(JwtAuthGuard)
    @Get('users')
    async getAllUsers(): Promise<MultiUsersResponseDTO> {
        return await this.userService.getUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateUser(@Session() session: SessionData, @Body() updateUserDTO: UpdateDTO): Promise<Response> {
        return await this.userService.updateUser(session, updateUserDTO);
    }

}