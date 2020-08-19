import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    matchRoles(requiredRoles, user): boolean {
        return requiredRoles.includes(user.role);
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        let authorized;
        if (!roles) {
            authorized = true;
        } else {
            const request = context.switchToHttp().getRequest();
            authorized = this.matchRoles(roles, request.user);
        }

        return authorized;
    }
}
