import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/user.schema';

export const InjectUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
});
