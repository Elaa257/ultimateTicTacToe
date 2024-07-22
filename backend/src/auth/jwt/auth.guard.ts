import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromCookie(request);
        return super.canActivate(context);
    }

    extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.['access_token'];
    }
}
