import { ICommand } from '@nestjs/cqrs';

export class DeleteOwnerCommand implements ICommand {
  constructor(
    public readonly ownerId: string,
  ) {}
}
