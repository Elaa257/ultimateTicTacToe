import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards} from '@nestjs/common';

import {registerDTO} from "./DTOs/registerDTO";
import {UserService} from "./user.service";
import {loginDTO} from "./DTOs/loginDTO";
import { Response } from 'express';
import {JwtAuthGuard} from "./jwt/auth.guard";
import {User} from "../user/user.entity";




@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() registerDTO: registerDTO): Promise<User> {
        return this.userService.register(registerDTO);
    }
    @Post('login')
    async login(@Body() loginDTO: loginDTO, @Res() res: Response): Promise<Response> {
        const { access_token, user } = await this.userService.login(loginDTO);
        res.cookie('access_token', access_token, { httpOnly: true });
        return res.json({ user });
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    getProtectedRoute() {
        return { message: 'This is a protected route' };
    }

    @Post('logout')
    async logout(@Res() res: Response): Promise<Response> {
        res.clearCookie('access_token');
        return res.status(HttpStatus.OK).json({message: 'Logged out successfully'});
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        await this.logout(res)
        await this.userService.delete(Number(id));
        return res.status(200).json({ message: 'User deleted successfully' });
    }

}