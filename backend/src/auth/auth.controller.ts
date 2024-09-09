import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDTO } from './DTOs/registerDTO';
import { AuthService } from './auth.service';
import { ResponseDTO } from '../DTOs/responseDTO';
import { LoginDTO } from './DTOs/loginDTO';
import { FastifyReply } from 'fastify';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('register')
  @ApiResponse({ type: ResponseDTO })
  async register(
    @Body() registerDTO: RegisterDTO,
    @Res() reply: FastifyReply
  ): Promise<void> {
    const { access_token, response } =
      await this.userService.register(registerDTO);
    reply
      .setCookie('access_token', access_token, {
        httpOnly: true, // Makes the cookie accessible only by the web server
        path: '/', //Makes the cookie accessible by all routes
      })
      .send(response);
  }

  @Post('login')
  @ApiResponse({ type: ResponseDTO })
  async login(
    @Body() loginDto: LoginDTO,
    @Res() reply: FastifyReply
  ): Promise<void> {
    const { access_token, response } = await this.userService.login(loginDto);
    reply
      .setCookie('access_token', access_token, {
        httpOnly: true, // Makes the cookie accessible only by the web server
        path: '/', //Makes the cookie accessible by all routes
      })
      .send(response);
  }

  @Post('logout')
  @ApiResponse({ type: ResponseDTO })
  async logout(@Res() reply: FastifyReply): Promise<void> {
    console.log('enter logout');
    try {
      reply.clearCookie('access_token', { path: '/' });
      console.log('Cookie cleared');
      reply.status(200).send(new ResponseDTO(true, `Logged out successfully`));
    } catch (error) {
      console.error('Error during logout:', error);
      reply.status(500).send(new ResponseDTO(false, `Logout failed ${error}`));
    }
  }

  @Get('auth-check')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseDTO })
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean }> {
    console.log('auth check');
    return { isAuthenticated: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  getCurrentUser(@Req() req) {
    return req.user;
  }
}
