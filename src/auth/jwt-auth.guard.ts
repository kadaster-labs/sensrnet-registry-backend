
import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }

  handleRequest(err, user, info) {
    // Can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      Logger.error(`Problem handling request: ${JSON.stringify(info.message)}`);
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
