import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    matchRoles(requiredRoles: string[], user: Record<string, any>): boolean {
        return requiredRoles.includes(user.role);
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        return roles ? this.matchRoles(roles, context.switchToHttp().getRequest().user) : true;
    }
}
