import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT Payload: ${JSON.stringify(payload)}`);

    const user = await this.userService.getUser(payload.id);

    return {
      id: user.user.id,
      email: user.user.email,
      nickname: user.user.nickname,
      role: user.user.role,
      elo: user.user.elo,
      profilePicture: user.user.profilePicture,
      wins: user.user.wins,
      loses: user.user.loses,
      draw: user.user.draw,
    };
  }
}
