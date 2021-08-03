import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserClass } from '../../user/schema/user.schema';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserClass;
  },
);
