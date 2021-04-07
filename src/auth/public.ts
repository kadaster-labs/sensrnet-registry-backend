import { SetMetadata } from '@nestjs/common';

// Define a decorator to indicate an endpoint is publicly accessible. By default, all endpoints require a valid JWT
// token https://docs.nestjs.com/security/authentication#enable-authentication-globally
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
