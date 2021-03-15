
import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('access') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }

  handleRequest(err, user, info) {
    // Can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      Logger.error('Problem handling request');
      throw err || new UnauthorizedException();
    }

    return user;
  }
}