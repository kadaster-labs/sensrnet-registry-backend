import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly ownerId?: string,
    public readonly password?: string,
    ) {}
}
