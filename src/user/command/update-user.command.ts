import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly organization?: string,
    public readonly password?: string,
    ) {}
}
