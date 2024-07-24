
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {UserService} from "../user.service";
import {Request} from "express";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.access_token;
            }]),
            secretOrKey: 'secret',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username, email: payload.email, role: payload.role};
    }
}
