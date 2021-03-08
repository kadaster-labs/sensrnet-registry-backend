import { ICommand } from '@nestjs/cqrs';
import { UserToken } from '../../auth/models/user-token';

export class RegisterOidcUserCommand implements ICommand {
  constructor(
    public readonly token: UserToken,
    ) {}
}