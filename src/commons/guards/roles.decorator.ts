import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: number[]): CustomDecorator => SetMetadata('roles', roles);
