import { ICommand } from '@nestjs/cqrs';

export class RegisterOidcUserCommand implements ICommand {
  constructor(
    public readonly token: Record<string, any>,
    ) {}
}