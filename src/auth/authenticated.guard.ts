// src/common/guards/authenticated.guard.ts
import { ExecutionContext, Injectable, CanActivate, Logger } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated: boolean = request.isAuthenticated();

    return isAuthenticated;
  }
}