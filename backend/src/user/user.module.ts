import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]),
        AuthModule,],
    controllers: [UserController],
    providers: [UserService, AuthService],
})
export class UserModule {}