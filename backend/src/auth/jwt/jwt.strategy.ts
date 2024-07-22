
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            //
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.access_token]),
            ignoreExpiration: false,
            secretOrKey: 'secret', // Replace with your secret key
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username, email: payload.email };
    }
}
