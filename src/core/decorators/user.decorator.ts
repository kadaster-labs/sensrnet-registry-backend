import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../../user/model/user.model';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IUser;
  },
);
