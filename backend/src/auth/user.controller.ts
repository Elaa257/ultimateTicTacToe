import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put, Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {User} from "../../database/User";
import {registerDTO} from "./DTOs/registerDTO";
import {UserService} from "./user.service";
import {loginDTO} from "./DTOs/loginDTO";
import {UpdateDTO} from "./DTOs/updateDTO";
import { Response, Request } from 'express';
import {JwtAuthGuard} from "./jwt/auth.guard";
import {UpdateResult} from "typeorm";
import {Roles} from "./roles/roles.decorator";
import {Role} from "./roles/enum.roles";
import {RolesGuard} from "./roles/roles.guard";




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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('deleteUserProfile')
    async deleteOwnProfile(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const user = req.user as any;
        const username = user.username;

        await this.userService.deleteUserProfile(username);
        return res.status(200).json({ message: 'User profile deleted successfully' });
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        await this.userService.delete(Number(id));
        return res.status(200).json({ message: 'User deleted successfully' });
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:id')
    async getOneUser(@Param('id') id: string): Promise<User> {
        const user = await this.userService.getUser(Number(id));
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('users')
    async getAllUsers(): Promise<User[]> {
        return await this.userService.getUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateUser(@Req() req: Request, @Body() updateUserDTO: UpdateDTO): Promise<UpdateResult> {
        const user = req.user as any
        const nickname = user.username

        const updatedUser = await this.userService.updateUser(nickname, updateUserDTO);
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return updatedUser;
    }

}