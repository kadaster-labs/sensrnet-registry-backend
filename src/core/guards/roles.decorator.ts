import { SetMetadata } from '@nestjs/common';
import { CustomDecorator} from '@nestjs/common';

export const Roles = (...roles: number[]): CustomDecorator => SetMetadata('roles', roles);
