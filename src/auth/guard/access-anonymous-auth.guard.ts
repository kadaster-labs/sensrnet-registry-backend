import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessAnonymousAuthGuard extends AuthGuard(['access', 'anonymous']) {}
