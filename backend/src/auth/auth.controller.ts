import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { RegisterDTO } from './DTOs/registerDTO';
import { AuthService } from './auth.service';
import { ResponseDTO } from '../DTOs/responseDTO';
import { SessionData } from 'express-session';
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
  async register(@Body() registerDTO: RegisterDTO): Promise<ResponseDTO> {
    return this.userService.register(registerDTO);
  }

  @Post('login')
  @ApiResponse({ type: ResponseDTO })
  async login(
    @Body() loginDto: LoginDTO,
    @Res() reply: FastifyReply
  ): Promise<void> {
    const { access_token, response, user } =
      await this.userService.login(loginDto);
    reply
      .setCookie('access_token', access_token, {
        httpOnly: true, // Makes the cookie accessible only by the web server
      })
      .send({ response, user });
  }

  @Post('logout')
  async logout(@Res() reply: FastifyReply): Promise<void> {
    console.log("enter logout");
    try {
      reply.clearCookie('access_token', { path: '/backend/auth' });
      console.log("Cookie cleared");
      reply.status(200).send({ response: { ok: true, message: 'logged out successfully' } });
    } catch (error) {
      console.error('Error during logout:', error);
      reply.status(500).send({ response: { ok: false, message: 'Logout failed' } });
    }
  }

  @Get('auth-check')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseDTO })
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean }> {
    console.log('auth check');
    return { isAuthenticated: true };
  }
}
