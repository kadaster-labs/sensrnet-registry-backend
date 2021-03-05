// src/common/guards/authenticated.guard.ts
import { ExecutionContext, Injectable, CanActivate, Logger } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    Logger.log('AuthenticatedGuard');
    const request = context.switchToHttp().getRequest();
    const isAuthenticated: boolean = request.isAuthenticated();
    Logger.log(`isAuthenticated: ${isAuthenticated}`)
    return isAuthenticated;
  }
}