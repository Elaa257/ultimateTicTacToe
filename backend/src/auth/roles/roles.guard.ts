import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './enum.roles';
import { ROLES_KEY } from './roles.decorator';
import {jwtDecode} from "jwt-decode";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if(!requiredRoles){
            return true;
        }

        const {user} = context.switchToHttp().getRequest();


        return requiredRoles.some((role) => user.role?.includes(role));
    }
}
