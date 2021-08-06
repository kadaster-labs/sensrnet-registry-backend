import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    matchRoles(requiredRoles: number[], user: Record<string, any>): boolean {
        return requiredRoles.includes(user.role);
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<number[]>('roles', context.getHandler());
        return roles ? this.matchRoles(roles, context.switchToHttp().getRequest().user) : true;
    }
}
