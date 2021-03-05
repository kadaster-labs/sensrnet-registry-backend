import { ICommand } from '@nestjs/cqrs';
import { TokenSet } from 'openid-client';

export class RegisterOidcUserCommand implements ICommand {
  constructor(
    public readonly token: TokenSet,
    ) {}
}