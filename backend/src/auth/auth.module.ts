// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from "./jwt/jwt.strategy";
import {User} from "../user/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register({
            secret: "secret",
            signOptions: {expiresIn: "1h"},
        })],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
})
export class AuthModule {}
