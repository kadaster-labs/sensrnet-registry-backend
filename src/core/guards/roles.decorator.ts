import { SetMetadata } from '@nestjs/common';
import { CustomDecorator} from '@nestjs/common';

export const Roles = (...roles: string[]): CustomDecorator => SetMetadata('roles', roles);
