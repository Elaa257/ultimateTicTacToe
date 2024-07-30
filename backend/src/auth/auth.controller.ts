import { Body, Controller, Post, Res, Session } from '@nestjs/common';
import { RegisterDTO } from './DTOs/registerDTO';
import { AuthService } from './auth.service';
import { ResponseDTO } from '../DTOs/responseDTO';
import { SessionData } from 'express-session';
import { LoginDTO } from './DTOs/loginDTO';
import { FastifyReply } from 'fastify';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

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
        const { access_token, response, user } = await this.userService.login(loginDto);
        reply
          .setCookie('access_token', access_token, {
              httpOnly: true, // Makes the cookie accessible only by the web server
          })
          .send({ response, user });
    }

  @Post('logout')
  @ApiResponse({ type: ResponseDTO })
  async logout(
    @Session() session: SessionData,
    @Res() reply: FastifyReply,
  ): Promise<ResponseDTO> {
    reply.clearCookie('access_token');
    session.isLoggedIn = undefined;
    return new ResponseDTO(true, 'logged out successfully');
  }
}