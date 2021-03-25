import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly legalEntityId?: string,
    public readonly leaveLegalEntity?: boolean,
    public readonly password?: string,
    ) {}
}
